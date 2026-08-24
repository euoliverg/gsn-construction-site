import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import Reveal from "./Reveal";
import BeforeAfterSlider from "./BeforeAfterSlider";
import Lightbox from "./Lightbox";
import {
  CATEGORIES,
  PROJECT_PHOTOS,
  PROGRESS_PAIRS,
  type ProjectCategory,
  type ProjectPhoto,
} from "../lib/projects";

type Filter = "All" | ProjectCategory;

function findPhoto(id: string) {
  return PROJECT_PHOTOS.find((p) => p.id === id)!;
}

/**
 * Deals photos out one category at a time so a single trade can't dominate the
 * top of the grid — bathroom work outnumbers everything else roughly 4 to 1.
 */
function interleaveByCategory(photos: ProjectPhoto[]): ProjectPhoto[] {
  const buckets = CATEGORIES.map((c) => photos.filter((p) => p.category === c)).filter(
    (b) => b.length > 0,
  );
  const out: ProjectPhoto[] = [];
  for (let i = 0; buckets.some((b) => i < b.length); i++) {
    for (const bucket of buckets) {
      if (i < bucket.length) out.push(bucket[i]);
    }
  }
  return out;
}

export default function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter !== "All") return PROJECT_PHOTOS.filter((p) => p.category === filter);
    // Lead with finished work across every trade, then the in-progress shots.
    return [
      ...interleaveByCategory(PROJECT_PHOTOS.filter((p) => p.status === "completed")),
      ...interleaveByCategory(PROJECT_PHOTOS.filter((p) => p.status === "progress")),
    ];
  }, [filter]);

  return (
    <section id="projects" className="bg-white py-24 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600">OUR WORK</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl sm:text-4xl lg:text-[2.6rem] text-balance">
            Built With Attention to Detail
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl">
            A real look at GSN Construction jobs — from framing and tile-setting through to the
            finished result.
          </p>
        </Reveal>

        {/* Featured before/after sliders */}
        <div className="mt-14 grid sm:grid-cols-2 gap-8">
          {PROGRESS_PAIRS.map((pair, i) => (
            <Reveal key={pair.id} delay={i * 80}>
              <BeforeAfterSlider
                beforeSrc={findPhoto(pair.before).src}
                afterSrc={findPhoto(pair.after).src}
                alt={pair.title}
              />
              <p className="mt-3 text-sm font-semibold text-navy-900">{pair.title}</p>
              <p className="text-xs text-gray-500">Drag the handle to compare</p>
            </Reveal>
          ))}
        </div>

        {/* Category filters */}
        <Reveal delay={80} className="mt-16 flex flex-wrap gap-2.5">
          {(["All", ...CATEGORIES] as Filter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFilter(cat);
                // Indexes point into `filtered`, so they'd dangle after a change.
                setLightboxIndex(null);
              }}
              aria-pressed={filter === cat}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                filter === cat
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-gray-200 text-gray-600 hover:border-navy-900/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {/* Photo grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((photo, i) => {
            return (
              <Reveal key={photo.id} delay={(i % 8) * 40}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 text-left"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    width={photo.width}
                    height={photo.height}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/0 to-navy-950/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide backdrop-blur-sm ${
                      photo.status === "completed"
                        ? "bg-blue-600/90 text-white"
                        : "bg-navy-950/75 text-white/90"
                    }`}
                  >
                    {photo.status === "completed" ? "Completed" : "In Progress"}
                  </span>

                  <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <Maximize2 size={14} />
                  </span>

                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {photo.title}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
