from backend.model.harness import Harness, ToolContext

def test_capacity_eviction_keeps_new_session_generation_owner():
    h = Harness()
    def ctx(s, g=1):
        return ToolContext(sessionId=s, campusId='beiyangyuan', channel='harness', generation=g)
    for i in range(256):
        h.begin(ctx(str(i))).ended = True
    newest = h.begin(ctx('new'))
    assert h.latest[('new', 'harness')] == (1, newest.id)
    assert ('0', 'harness') not in h.latest
    replacement = h.begin(ctx('new', 2))
    assert newest.cancelled
    assert h.latest[('new', 'harness')] == (2, replacement.id)
