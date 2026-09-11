import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import Reveal from "./Reveal";
import { PROJECT_VIDEOS } from "../lib/videos";

export default function VideoShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = PROJECT_VIDEOS.find((v) => v.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section className="bg-navy-950 py-24 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400">ON THE JOB</span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl sm:text-4xl lg:text-[2.6rem] text-balance">
            See Our Crew In Action
          </h2>
          <p className="mt-4 text-lg text-blue-100/70 max-w-xl">
            Real footage from real job sites — no stock photos, just the GSN Construction crew at
            work.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {PROJECT_VIDEOS.map((video, i) => (
            <Reveal key={video.id} delay={i * 90} className={i === 0 ? "col-span-2 sm:col-span-1" : ""}>
              <button
                type="button"
                onClick={() => setActiveId(video.id)}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-navy-900 text-left shadow-elevated"
              >
                <img
                  src={video.poster}
                  alt={video.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-navy-950/20" />

                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-600">
                    <Play size={22} className="ml-1" fill="currentColor" />
                  </span>
                </span>

                <span className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <span className="block text-sm font-semibold text-white leading-snug">
                    {video.title}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950/96 backdrop-blur-sm animate-fade-in px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — video player`}
          onClick={() => setActiveId(null)}
        >
          <div className="flex w-full max-w-md items-center justify-between pb-3">
            <p className="text-sm font-semibold text-white">{active.title}</p>
            <button
              type="button"
              onClick={() => setActiveId(null)}
              aria-label="Close video"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>
          <video
            key={active.id}
            src={active.src}
            poster={active.poster}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] w-full max-w-md rounded-lg shadow-elevated animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
