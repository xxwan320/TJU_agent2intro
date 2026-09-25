import { useEffect, useMemo, useRef, useState } from 'react';
import type { CampusId } from '../../../shared/contracts';
import { registeredPhotos } from './tour-photos';

const AUTO_MS = 7000;

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function PhotoCarousel({ campus }: { campus: CampusId }) {
  const photos = useMemo(() => shuffled(registeredPhotos().filter((photo) => photo.campus === campus)), [campus]);
  const [index, setIndex] = useState(0);
  const dragStart = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (!paused.current) setIndex((value) => (value + 1) % photos.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  if (!photos.length) return null;
  const current = photos[index % photos.length];
  const step = (delta: number) => setIndex((value) => (value + delta + photos.length) % photos.length);

  return <section className="tour-carousel" aria-label="校园点位图片" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
    <img key={current.src} className="tour-carousel-image" src={current.src} alt={current.caption} loading="eager"
      onPointerDown={(event) => { dragStart.current = event.clientX; }}
      onPointerUp={(event) => {
        if (dragStart.current === null) return;
        const delta = event.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(delta) > 40) step(delta < 0 ? 1 : -1);
      }}
      onPointerCancel={() => { dragStart.current = null; }}/>
    <button type="button" className="tour-carousel-arrow prev" aria-label="上一张点位图片" onClick={() => step(-1)}>‹</button>
    <button type="button" className="tour-carousel-arrow next" aria-label="下一张点位图片" onClick={() => step(1)}>›</button>
    <div className="tour-carousel-caption"><strong>{current.caption}</strong><span>{index + 1} / {photos.length} · 左右滑动切换</span></div>
  </section>;
}
