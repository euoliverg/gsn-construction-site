import { useRef, useState, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  /**
   * Aspect ratio of the frame. Both photos are cropped with object-cover to
   * fill it, so pass the ratio the source photos were shot at to avoid losing
   * the top and bottom of a portrait shot.
   */
  aspectClass?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "In Progress",
  afterLabel = "Completed",
  alt,
  aspectClass = "aspect-[3/4] sm:aspect-[4/3]",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectClass} w-full select-none overflow-hidden rounded-2xl shadow-elevated touch-none`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <img
        src={afterSrc}
        alt={`${alt} — completed`}
        width={1200}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <img
        src={beforeSrc}
        alt={`${alt} — in progress`}
        width={1200}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />

      <span className="absolute top-4 left-4 rounded-full bg-navy-950/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-wide text-white/90">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-wide text-white">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_0_1px_rgba(7,24,43,0.15)]"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Comparison slider for ${alt}`}
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 cursor-ew-resize items-center justify-center rounded-full bg-white text-navy-900 shadow-elevated focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-500"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 4L2 9L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 4L16 9L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
