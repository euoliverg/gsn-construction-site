import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { CallSplitButton } from "./CallButtons";

export default function FinalCTA() {
  return (
    <section className="relative bg-navy-950 py-24 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(22,136,255,0.18),transparent_65%)]" />

      <div className="container-px mx-auto max-w-3xl relative text-center">
        <Reveal>
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-[2.75rem] text-balance">
            Let&apos;s Talk About Your Next Project.
          </h2>
          <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto">
            Whether you&apos;re improving one room or upgrading multiple areas of your home, tell
            us what you have in mind.
          </p>
        </Reveal>

        {/* No transform wrapper here: see note in Hero.tsx about iOS Safari blocking tel: taps mid-animation. */}
        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-[0_14px_36px_-10px_rgba(8,102,217,0.75)] transition-all hover:-translate-y-0.5"
          >
            Request a Free Estimate
            <ArrowRight size={18} />
          </Link>
          <CallSplitButton />
        </div>
      </div>
    </section>
  );
}
