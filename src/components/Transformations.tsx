import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { TRANSFORMATIONS, PROJECT_PHOTOS } from "../lib/projects";

function findPhoto(id: string) {
  return PROJECT_PHOTOS.find((p) => p.id === id)!;
}

export default function Transformations() {
  return (
    <section className="relative bg-navy-950 py-24 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container-px mx-auto max-w-7xl relative">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400">REAL RESULTS</span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl sm:text-4xl lg:text-[2.6rem] text-balance">
            Transformations, Start to Finish
          </h2>
          <p className="mt-4 text-lg text-white/60 max-w-xl">
            Beyond tile and finishes — real exterior work, from structural repairs to a full
            repaint. Drag to see the difference.
          </p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-8">
          {TRANSFORMATIONS.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <BeforeAfterSlider
                beforeSrc={findPhoto(t.before).src}
                afterSrc={findPhoto(t.after).src}
                beforeLabel={t.beforeLabel}
                afterLabel={t.afterLabel}
                alt={t.title}
              />
              <span className="mt-5 inline-block rounded-full bg-blue-500/15 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-300">
                {t.tag}
              </span>
              <h3 className="mt-3 font-display font-bold text-white text-xl">{t.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed max-w-md">{t.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-blue-50 px-7 py-4 text-base font-semibold text-navy-900 shadow-elevated transition-all hover:-translate-y-0.5"
          >
            Start Your Project
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
