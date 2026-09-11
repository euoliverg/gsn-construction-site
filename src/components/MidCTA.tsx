import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { CallSplitButton } from "./CallButtons";

export default function MidCTA() {
  return (
    <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-blue-700 py-20 sm:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-[90px]" />

      <div className="container-px mx-auto max-w-4xl relative text-center">
        <Reveal>
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl text-balance">
            Planning a Home Improvement Project?
          </h2>
          <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
            Tell us what you need and get started with a free estimate.
          </p>
        </Reveal>

        {/* No transform wrapper here: see note in Hero.tsx about iOS Safari blocking tel: taps mid-animation. */}
        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-blue-50 px-7 py-4 text-base font-semibold text-navy-900 shadow-elevated transition-all hover:-translate-y-0.5"
          >
            Get My Free Estimate
            <ArrowRight size={18} />
          </Link>
          <CallSplitButton />
        </div>
      </div>
    </section>
  );
}
