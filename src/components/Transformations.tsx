import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { FEATURED_REPAIR, PROJECT_PHOTOS } from "../lib/projects";

function findPhoto(id: string) {
  return PROJECT_PHOTOS.find((p) => p.id === id)!;
}

export default function Transformations() {
  const repair = FEATURED_REPAIR;
  const detail = findPhoto(repair.detail);

  return (
    <section className="relative bg-navy-950 py-24 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container-px mx-auto max-w-7xl relative">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400">FEATURED REPAIR</span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl sm:text-4xl lg:text-[2.6rem] text-balance">
            {repair.title}
          </h2>
          <p className="mt-4 text-lg text-white/60">{repair.description}</p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-12 lg:items-center">
          <Reveal>
            <BeforeAfterSlider
              beforeSrc={findPhoto(repair.before).src}
              afterSrc={findPhoto(repair.after).src}
              beforeLabel={repair.beforeLabel}
              afterLabel={repair.afterLabel}
              alt={repair.title}
              // Both photos are 1200x1600, so a 3:4 frame shows them uncropped.
              aspectClass="aspect-[3/4]"
            />
            <p className="mt-3 text-xs text-white/45">
              Drag the handle to compare the same wall before and after the rebuild.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <span className="inline-block rounded-full bg-blue-500/15 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-300">
              {repair.tag}
            </span>

            <h3 className="mt-4 font-display font-bold text-white text-xl">
              What the job involved
            </h3>

            <ul className="mt-5 space-y-3">
              {repair.scope.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-white/70 leading-relaxed">
                  <Check size={18} className="mt-0.5 shrink-0 text-blue-400" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>

            <figure className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <img
                src={detail.src}
                alt={detail.title}
                loading="lazy"
                width={detail.width}
                height={detail.height}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <figcaption className="text-sm text-white/55 leading-relaxed">
                A closer look at the rot that was found once the siding came off.
              </figcaption>
            </figure>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-blue-50 px-7 py-4 text-base font-semibold text-navy-900 shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Get My Free Estimate
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
