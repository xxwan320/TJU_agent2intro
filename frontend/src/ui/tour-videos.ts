// Companion video registry for narration playback.
//
// The avatar raises one hand and shows the clip bound here while a POI is being
// narrated. The backend retrieves local clips; this registry is an optional
// fallback. Missing clips hide the presentation screen.
import {cachedRead} from '../transport/cached-read';
export interface TourVideo {
  id?:string;
  kind?:string;
  src: string;
  mime?: string;
  caption?: string;
  poster?: string;
  creator?: string | null;
  license?: string | null;
  sourceUrl?: string | null;
}

const VIDEOS: Record<string, TourVideo> = {
  // Example:
  // 'weijinlu-newton-tree': { src: '/assets/campus/videos/weijinlu-newton-tree-1.mp4', caption: '牛顿苹果树' },
};

export function tourVideoFor(poiId: string | null | undefined): TourVideo | null {
  if (!poiId) return null;
  return VIDEOS[poiId] ?? null;
}

const readVideo=cachedRead<TourVideo|null>();
export async function findTourVideo(poiId: string, campusId: string, query: string, signal: AbortSignal): Promise<TourVideo | null> {
  const key=JSON.stringify([campusId,poiId,query.slice(0,1000)]);
  return readVideo(key,signal,async shared=>{
  const params = new URLSearchParams({poi_id: poiId, campus_id: campusId, query: query.slice(0, 1000)});
  const response = await fetch('/api/knowledge/videos/search?' + params, {signal:AbortSignal.any([shared,AbortSignal.timeout(4000)])});
  if (!response.ok) return tourVideoFor(poiId);
  const body = await response.json();
  const video = body.video;
  const result=video?.poi_id === poiId && video.campus_id===campusId && typeof video.src === 'string' && video.src.startsWith('/api/knowledge/videos/file/')
    ? {id:video.id,kind:video.kind,src: video.src, mime: video.mime, caption: video.caption,poster:video.poster} : tourVideoFor(poiId);
  return result;
  });
}

export function registeredVideos(): TourVideo[] {
  return Object.values(VIDEOS);
}
