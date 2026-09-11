import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import HeroScene from "./HeroScene";
import { CallSplitButton } from "./CallButtons";

const TRUST_ITEMS = [
  "Free Estimates",
  "Seattle & Surrounding Areas",
  "Residential Improvements",
  "Direct Contractor Communication",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy-950 pt-[104px] pb-16 sm:pt-[128px] sm:pb-24 lg:pt-[150px] lg:pb-28"
    >
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(22,136,255,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(8,102,217,0.14),transparent_60%)]" />
        <div className="absolute inset-0 blueprint-grid opacity-[0.35]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
      </div>

      <div className="container-px mx-auto max-w-7xl relative grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-8 items-center">
        <div>
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
              SEATTLE, WASHINGTON
            </span>

            <h1 className="mt-6 text-balance font-display font-bold text-white text-[2.5rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              Built Right.
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-200 bg-clip-text text-transparent">
                Built to Last.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/85 font-medium max-w-xl">
              Professional construction and home improvement services throughout Seattle and
              surrounding areas.
            </p>

            <p className="mt-4 text-base text-white/60 max-w-xl leading-relaxed">
              From roofing and flooring to painting, bathrooms, doors, windows and outdoor
              improvements, GSN Construction LLC delivers dependable craftsmanship for your home.
            </p>
          </div>

          {/*
            No transform on this wrapper (opacity-only fade): iOS Safari can treat a tap
            on a tel: link as "not user-initiated" if an ancestor still has an active
            CSS transform running, and blocks the call outright.
          */}
          <div className="mt-9 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_36px_-10px_rgba(8,102,217,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-8px_rgba(22,136,255,0.85)]"
              >
                Get a Free Estimate
                <ArrowRight size={18} />
              </Link>
              <CallSplitButton />
            </div>

            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-lg">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative h-[340px] sm:h-[420px] lg:h-[560px] animate-fade-in">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
