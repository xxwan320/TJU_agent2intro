"""C is the sole TourSession authority; LLM history remains the original store."""
import asyncio
from collections import OrderedDict
from dataclasses import dataclass
import hashlib
import json
import time
from uuid import uuid4
from backend.common.errors import DomainError
from backend.r3_contracts import TourRequest, TourResult, TourSession, StopProgress, ClarificationQuestion
from .runtime import runtime
from .tour_catalog import utcnow
from .tour_planner import Planner, understand
from .privacy import redact_coordinates, has_coordinates


@dataclass
class Idempotent:
    fingerprint: str
    created: float
    result: TourResult | None = None
    error: tuple | None = None


class TourService:
    implementation = 'implemented'

    def __init__(self, planner=None, store=runtime, ttl=3600, capacity=1000, clock=time.monotonic):
        self.planner = planner or Planner()
        self.runtime = store
        self.ttl, self.capacity, self.clock = ttl, capacity, clock
        self.tours = OrderedDict()
        self.touched = {}
        self.ticks = {}
        self.expired = OrderedDict()
        self.requests = OrderedDict()
        self.expired_requests = OrderedDict()
        self.metrics = OrderedDict()

    def _prune(self):
        now = self.clock()
        for tid in list(self.tours):
            if now-self.touched[tid] >= self.ttl:
                del self.tours[tid], self.touched[tid]
                self.ticks.pop(tid, None)
                self.expired[tid] = now
        for key, value in list(self.requests.items()):
            if now-value.created >= self.ttl and (value.result or value.error):
                self.expired_requests[key] = now
                del self.requests[key]
        while len(self.expired_requests) > self.capacity:
            self.expired_requests.popitem(last=False)
        while len(self.expired) > self.capacity:
            self.expired.popitem(last=False)
        while len(self.metrics) > self.capacity:
            self.metrics.popitem(last=False)

    def _read(self, tid, sid):
        self._prune()
        session = self.tours.get(tid)
        if not session or session.session_id != sid:
            raise DomainError('TOUR_EXPIRED' if tid in self.expired else 'TOUR_NOT_FOUND', '行程不存在或已过保留期', 404)
        self.touched[tid] = self.clock()
        return session.model_copy(deep=True)

    async def read(self, tour_id, session_id):
        return self._read(tour_id, session_id)

    def _versions(self, session, body):
        if (session.plan.version, session.state_version) != (body.expected_version, body.expected_state_version):
            raise DomainError('TOUR_VERSION_CONFLICT', '计划或执行版本已变化，请重新读取', 409, body.request_id)

    async def _run(self, path, body, operation):
        self._prune()
        key = (body.session_id, body.request_id)
        fingerprint = hashlib.sha256((path+'\n'+body.model_dump_json()).encode()).hexdigest()
        if key in self.expired_requests:
            raise DomainError("TOUR_EXPIRED", "请求已过保留期，请使用新的请求ID", 404, body.request_id)
        previous = self.requests.get(key)
        if previous:
            if previous.fingerprint != fingerprint:
                raise DomainError('TOUR_IDEMPOTENCY_CONFLICT', '同一请求ID对应不同操作', 409, body.request_id)
            if previous.result:
                return previous.result.model_copy(deep=True, update={'replayed': True})
            if previous.error:
                raise DomainError(*previous.error)
            raise DomainError('TOUR_REQUEST_IN_PROGRESS', '相同操作尚在处理中', 409, body.request_id)
        if len(self.requests) >= self.capacity:
            raise DomainError('TOUR_CAPACITY', '行程请求保留容量已满', 429, body.request_id)
        record = self.runtime.begin(body.request_id, body.session_id)
        entry = Idempotent(fingerprint, self.clock())
        self.requests[key] = entry
        started = self.clock()
        metrics = {'model_calls': 0, 'web_calls': 0, 'map_operations': 0,
            'failure_retries': 0, 'first_content_ms': None, 'usage': None,
            'elapsed': lambda: (self.clock()-started)*1000}
        self.runtime.emit(body.request_id, 'request', 'started')
        try:
            async with asyncio.timeout(120):
                session, usage, history_commit = await operation(metrics)
            if record.cancel_requested:
                raise asyncio.CancelledError
            if self.clock()-started >= 120:
                raise TimeoutError
            if session.tour_id in self.tours and hasattr(body, 'expected_version'):
                self._versions(self.tours[session.tour_id], body)
            session = TourSession.model_validate(session.model_dump())
            # No await from cancellation/version check through state/history commit.
            if session.tour_id not in self.tours and len(self.tours) >= self.capacity:
                raise DomainError('TOUR_CAPACITY', '行程保留容量已满', 429, body.request_id)
            questions = [ClarificationQuestion(question_id=f'question-{i}', field='message', prompt=w)
                for i,w in enumerate(session.plan.warnings) if w.startswith(('请明确','请确认可接受')) or '请集中确认' in w][:8] if session.status in ('draft','infeasible') else []
            result = TourResult(request_id=body.request_id, session=session, usage=usage,
                clarification_required=bool(questions), clarifications=questions)
            if history_commit:
                history_commit()
            old = self.tours.get(session.tour_id)
            previous_tick = self.ticks.get(session.tour_id, self.clock())
            self.tours[session.tour_id] = session.model_copy(deep=True)
            self.touched[session.tour_id] = self.clock()
            if path == '/tours/restore' and old is not None:
                pass
            elif old and old.status == 'active' and session.status == 'active':
                self.ticks[session.tour_id] = previous_tick + int(max(0,self.clock()-previous_tick)/60)*60
            else:
                self.ticks[session.tour_id] = self.clock()
            entry.result = result.model_copy(deep=True)
            self.runtime.finish(body.request_id, 'completed')
            self.runtime.emit(body.request_id, 'request', 'completed', duration_ms=metrics['elapsed']())
            metrics['task_completed'] = session.status == 'completed' and session.completion_reason == 'all_stops_resolved' and all(p.state == 'completed' for p in session.progress)
            metrics['outcome'] = 'pass'
            return result
        except (asyncio.CancelledError, TimeoutError) as error:
            cancelled = isinstance(error, asyncio.CancelledError)
            status = 'cancelled' if cancelled else 'failed'
            code = 'CANCELLED' if cancelled else 'UPSTREAM_TIMEOUT'
            entry.error = (code, '操作已取消或超过期限；迟到结果未提交', 499 if cancelled else 503, body.request_id)
            self.runtime.finish(body.request_id, status)
            self.runtime.emit(body.request_id, 'request', status, {'code': code})
            metrics['outcome'] = 'fail'
            raise DomainError(*entry.error) from None
        except Exception as error:
            if isinstance(error, DomainError):
                entry.error = (error.code, error.message, error.status, body.request_id, error.retryable)
            else:
                entry.error = ('internal_error', '行程操作失败', 500, body.request_id)
            self.runtime.finish(body.request_id, 'failed')
            self.runtime.emit(body.request_id, 'request', 'failed', {'code': entry.error[0]})
            metrics['outcome'] = 'fail'
            raise DomainError(*entry.error) from None
        finally:
            metrics['elapsed_ms'] = metrics.pop('elapsed')()
            metrics['usage'] = metrics['usage'].model_dump() if metrics['usage'] else None
            metrics['unknown_usage_calls'] = metrics['model_calls'] if metrics['usage'] is None else 0
            metrics['usage_status'] = 'unknown' if metrics['usage'] is None else 'known'
            self.metrics[key] = metrics
            record.task = None

    async def create(self, body):
        async def op(metrics):
            safe = TourRequest.model_validate(body.model_copy(update={'message': redact_coordinates(body.message), 'interests': [redact_coordinates(x) for x in body.interests]}).model_dump())
            plan, usage, service = await self.planner.create(safe, metrics)
            if any(has_coordinates(x) for x in [body.message, *body.interests]):
                plan.warnings.insert(0, '精确位置已移除，请通过导航位置入口提供起点。')
            session = TourSession(tour_id=uuid4(), session_id=body.session_id, state_version=1,
                status=plan.status, plan=plan, progress=[StopProgress(stop_id=s.stop_id, state='pending') for s in plan.stops],
                current_stop_id=None, remaining_minutes=body.duration_minutes, saved=False, updated_at=utcnow())
            def commit():
                if metrics['model_calls']:
                    service.history.commit(body.session_id, '行程需求：'+ '；'.join([safe.message, *safe.interests]),
                        '目录候选计划：'+ '、'.join(s.poi_id for s in plan.stops)+'；状态：'+plan.status)
            return session, usage, commit
        return await self._run('/tours', body, op)

    def _elapsed(self, session):
        if session.status == 'active':
            elapsed = int(max(0, self.clock()-self.ticks.get(session.tour_id, self.clock()))/60)
            session.remaining_minutes = max(0, session.remaining_minutes-elapsed)

    def _transition(self, session, action, stop_id=None):
        current = next((p for p in session.progress if p.stop_id == session.current_stop_id), None)
        def require(condition):
            if not condition:
                raise DomainError('TOUR_INVALID_TRANSITION', '当前状态不允许此操作', 409)
        if action in ('save', 'forget'):
            session.saved = action == 'save'
        elif action == 'cancel':
            require(session.status in ('draft', 'checked', 'active', 'paused', 'infeasible'))
            session.status = 'cancelled'
        elif action == 'start':
            require(session.status == 'checked')
            current = next((p for p in session.progress if p.state == 'pending'), None)
            require(current is not None)
            session.status = 'active'; session.current_stop_id = current.stop_id; current.state = 'navigating'
        elif action in ('arrive', 'explain', 'complete_stop'):
            require(session.status == 'active' and current is not None and current.stop_id == stop_id)
            allowed = {'arrive': ('navigating',), 'explain': ('arrived',), 'complete_stop': ('arrived', 'explaining')}
            require(current.state in allowed[action])
            current.state = {'arrive':'arrived', 'explain':'explaining', 'complete_stop':'completed'}[action]
            if all(p.state in ('completed', 'skipped') for p in session.progress):
                session.status = 'completed'; session.current_stop_id = None; session.completion_reason = 'all_stops_resolved'
        elif action == 'next':
            require(session.status == 'active' and current is not None and current.state in ('completed', 'skipped'))
            pending = next((p for p in session.progress if p.state == 'pending'), None)
            if pending:
                session.current_stop_id = pending.stop_id; pending.state = 'navigating'
            else:
                session.status = 'completed'; session.current_stop_id = None; session.completion_reason = 'all_stops_resolved'
        elif action == 'pause':
            require(session.status == 'active'); session.status = 'paused'
        elif action == 'resume':
            require(session.status == 'paused' and session.remaining_minutes > 0)
            session.status = 'active'
            if current and current.state == 'explaining':
                current.state = 'arrived'
        elif action == 'skip':
            # Reserved internal semantics pending M's command enum coordination.
            require(session.status == 'active' and current is not None and (stop_id is None or current.stop_id == stop_id) and current.state not in ('completed', 'skipped'))
            current.state = 'skipped'
            self._transition(session, 'next')
        elif action == 'end':
            require(session.status in ('active', 'paused'))
            for item in session.progress:
                if item.state != 'completed':
                    item.state = 'skipped'
            session.current_stop_id = None; session.status = 'completed'; session.completion_reason = 'user_ended'
        else:
            require(False)

    async def command(self, tour_id, body):
        async def op(metrics):
            session = self._read(tour_id, body.session_id)
            self._versions(session, body); self._elapsed(session)
            if body.action == 'check':
                if session.status != 'draft':
                    raise DomainError('TOUR_INVALID_TRANSITION', '只有草稿可以确认检查', 409)
                if any('请集中确认' in w or '请明确' in w or '请确认可接受' in w for w in session.plan.warnings):
                    raise DomainError('TOUR_INFEASIBLE', '仍有影响可行性的需求待集中澄清，请重新提交需求', 422)
                await self.planner.check(session.plan, session.remaining_minutes, body.request_id)
                session.status = 'infeasible' if session.plan.status == 'infeasible' else 'checked'
                session.plan.status = session.status; session.plan.version += 1
            else:
                if body.action in ('start','resume') and not body.accept_unverified:
                    if (session.plan.request.accessibility == 'step_free' or
                        any(l.duration_s is None or l.verification != 'verified' or l.campus_access != 'verified' for l in session.plan.legs)):
                        raise DomainError('TOUR_UNVERIFIED_ACK_REQUIRED', '路线或通行尚未核实，请明确确认后开始或恢复', 422)
                self._transition(session, body.action, body.stop_id)
            session.state_version += 1; session.updated_at = utcnow()
            return session, None, None
        return await self._run(f'/tours/{tour_id}/commands', body, op)

    async def revise(self, tour_id, body):
        async def op(metrics):
            session = self._read(tour_id, body.session_id)
            self._versions(session, body); self._elapsed(session)
            if session.status not in ('draft', 'checked', 'active', 'paused'):
                raise DomainError('TOUR_INVALID_TRANSITION', '终态不能修改计划', 409)
            if body.operation == 'set_remaining_time':
                if body.remaining_minutes > session.remaining_minutes:
                    raise DomainError('TOUR_INFEASIBLE', '本操作仅缩短剩余时间', 422)
                session.remaining_minutes = body.remaining_minutes
                pending = [s for s in session.plan.stops if next(p for p in session.progress if p.stop_id == s.stop_id).state not in ('completed', 'skipped')]
                if session.remaining_minutes < len(pending):
                    raise DomainError('TOUR_INFEASIBLE', '剩余时间不足以保留每站至少一分钟', 422)
                for stop in pending:
                    progress = next(p for p in session.progress if p.stop_id == stop.stop_id)
                    if progress.state == 'explaining' and session.status != 'paused':
                        raise DomainError('TOUR_STOP_LOCKED', '请先暂停再调整正在讲解的站点', 409)
                    stop.visit_minutes = min(stop.visit_minutes, max(1, session.remaining_minutes//max(1, len(pending)*2)))
            else:
                progress = next((p for p in session.progress if p.stop_id == body.stop_id), None)
                if not progress:
                    raise DomainError('VALIDATION_ERROR', '站点不存在', 422)
                if progress.state in ('completed', 'skipped') or (body.stop_id == session.current_stop_id and session.status != 'paused'):
                    raise DomainError('TOUR_STOP_LOCKED', '已完成站点不可改；当前站点请先暂停', 409)
                index = next(i for i,s in enumerate(session.plan.stops) if s.stop_id == body.stop_id)
                old = session.plan.stops[index]
                constraints = understand('；'.join([session.plan.request.message, *session.plan.request.interests]), self.planner.catalog, session.plan.campus_id)
                required = set(constraints.must_visit) | set(session.plan.request.must_visit) | {p.poi_id for p in (session.plan.request.start, session.plan.request.end) if p.kind == 'poi'}
                if old.poi_id in required or body.replacement_poi_id in set(constraints.avoid) | set(session.plan.request.avoid):
                    raise DomainError('TOUR_INFEASIBLE', '修改违反原必去、避开或起终点约束，请重新明确需求', 422)
                if body.operation == 'remove_stop':
                    session.plan.stops.pop(index); session.progress.remove(progress)
                    if not session.plan.stops or not any(p.state not in ('completed','skipped') for p in session.progress):
                        raise DomainError('TOUR_INFEASIBLE', '请用结束操作终止剩余行程', 422)
                else:
                    if body.replacement_poi_id in [s.poi_id for s in session.plan.stops]:
                        raise DomainError('TOUR_INFEASIBLE', '替换地点重复', 422)
                    new, _ = self.planner.stop(body.replacement_poi_id, session.plan.campus_id, old.visit_minutes)
                    session.plan.stops[index] = new
                    progress.stop_id = new.stop_id; progress.state = 'pending'
                if body.stop_id == session.current_stop_id:
                    next_pending = next(p for p in session.progress if p.state not in ('completed', 'skipped'))
                    session.current_stop_id = next_pending.stop_id; next_pending.state = 'navigating'
            remaining_ids = {p.stop_id for p in session.progress if p.state not in ('completed','skipped')}
            completed = {s.stop_id:s.model_copy(deep=True) for s in session.plan.stops if s.stop_id not in remaining_ids}
            await self.planner.check(session.plan, session.remaining_minutes, body.request_id, remaining_ids)
            for index, stop in enumerate(session.plan.stops):
                if stop.stop_id in completed:
                    # Identity, visit allocation and purpose of completed stops stay fixed.
                    stop.visit_minutes = completed[stop.stop_id].visit_minutes
                    stop.purpose = completed[stop.stop_id].purpose

            if session.plan.status == 'infeasible':
                raise DomainError('TOUR_INFEASIBLE', '修改后已知约束不可行，原计划保持有效', 422)
            session.plan.version += 1; session.state_version += 1; session.updated_at = utcnow()
            return session, None, None
        return await self._run(f'/tours/{tour_id}/revisions', body, op)

    async def restore(self, body):
        async def op(metrics):
            snapshot = body.snapshot.model_copy(deep=True)
            if snapshot.tour_id in self.tours:
                existing = self._read(snapshot.tour_id, body.session_id)
                if existing.status == 'active':
                    self._elapsed(existing)
                    existing.status = 'paused'
                    existing.state_version += 1
                    existing.updated_at = utcnow()
                    for progress in existing.progress:
                        if progress.state == 'explaining': progress.state = 'arrived'
                return existing, None, None
            if snapshot.updated_at > utcnow() or snapshot.plan.created_at > utcnow():
                raise DomainError('TOUR_RESTORE_INVALID', '保存快照时间无效', 422)
            text_values = [snapshot.plan.request.message, *snapshot.plan.request.interests, *snapshot.plan.warnings,
                *[v for stop in snapshot.plan.stops for v in (stop.title,stop.purpose)],
                *[v for item in snapshot.plan.evidence for v in (item.claim,item.source_ref)]]
            if any(has_coordinates(value) for value in text_values):
                raise DomainError('TOUR_RESTORE_INVALID', '保存快照不得含精确位置', 422)
            if [p.stop_id for p in snapshot.progress] != [s.stop_id for s in snapshot.plan.stops]:
                raise DomainError('TOUR_RESTORE_INVALID', '保存进度顺序与计划不一致', 422)
            unfinished_seen = False
            active_count = 0
            for progress in snapshot.progress:
                if progress.state == 'completed' and unfinished_seen:
                    raise DomainError('TOUR_RESTORE_INVALID', '已完成站点必须是执行序列前缀', 422)
                if progress.state not in ('completed', 'skipped'):
                    unfinished_seen = True
                if progress.state in ('navigating', 'arrived', 'explaining'):
                    active_count += 1
                    if progress.stop_id != snapshot.current_stop_id:
                        raise DomainError('TOUR_RESTORE_INVALID', '当前站点与进度不一致', 422)
            if active_count > 1 or (snapshot.status in ('draft','checked','infeasible') and (active_count or snapshot.current_stop_id is not None or any(p.state != 'pending' for p in snapshot.progress))):
                raise DomainError('TOUR_RESTORE_INVALID', '保存进度不合法', 422)
            if snapshot.status == 'completed' and any(p.state not in ('completed','skipped') for p in snapshot.progress):
                raise DomainError('TOUR_RESTORE_INVALID', '完成状态与站点不一致', 422)
            if snapshot.status in ('active','paused') and snapshot.current_stop_id is None:
                raise DomainError('TOUR_RESTORE_INVALID', '执行快照缺少当前站点', 422)
            # Discard all client facts, costs and generated explanations. Rebuild
            # identity and evidence against the live directory, including campus.
            for place in (snapshot.plan.request.start, snapshot.plan.request.end):
                if place.kind == 'poi':
                    self.planner.catalog.poi(place.poi_id, snapshot.plan.campus_id)
            for stop in snapshot.plan.stops:
                stop.purpose = '恢复后重新核验的目录站点；停留时长为规划分配。'
                stop.visit_time_source = 'planner_allocation'
            snapshot.plan.evidence = []; snapshot.plan.legs = []; snapshot.plan.warnings = []
            remaining_ids = {p.stop_id for p in snapshot.progress if p.state not in ('completed','skipped')}
            if snapshot.plan.stops:
                await self.planner.check(snapshot.plan, snapshot.remaining_minutes, body.request_id, remaining_ids)
            if snapshot.plan.status == 'infeasible' and snapshot.status not in ('draft','infeasible','cancelled'):
                raise DomainError('TOUR_RESTORE_INVALID', '当前资料不能支持恢复执行，请重新规划', 422)
            if snapshot.status == 'active':
                snapshot.status = 'paused'
            for progress in snapshot.progress:
                if progress.state == 'explaining':
                    progress.state = 'arrived'
            snapshot.tour_id = uuid4(); snapshot.plan.version += 1; snapshot.state_version += 1
            snapshot.updated_at = utcnow()
            return snapshot, None, None
        return await self._run('/tours/restore', body, op)

    def explanation_context(self, tour_id, session_id):
        session = self._read(tour_id, session_id)
        current = next((p for p in session.progress if p.stop_id == session.current_stop_id), None)
        if session.status != 'active' or not current or current.state not in ('arrived','explaining'):
            raise DomainError('TOUR_INVALID_TRANSITION', '请先确认到达当前站点', 409)
        stop = next(s for s in session.plan.stops if s.stop_id == current.stop_id)
        evidence = self.planner.catalog.evidence(stop.poi_id, session.plan.campus_id)
        return {'selected_poi_id': stop.poi_id, 'campus_id': session.plan.campus_id,
            'plan_version': session.plan.version, 'state_version': session.state_version,
            'evidence': [e.model_dump(mode='json') for e in evidence],
            'requirements': '只讲解当前站点。关键事实需附资料适用性及核验状态；历史开放不作为今日规则。'}


tour_service = TourService()
