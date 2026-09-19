import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function ReviewCTA() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 px-7 py-10 text-white shadow-elevated sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
            <div className="relative max-w-2xl">
              <div className="flex items-center gap-1 text-amber-400" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill="currentColor" />)}
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold">Worked With GSN Construction?</h2>
              <p className="mt-3 text-white/65">Share your honest experience. Reviews publish automatically, while verified-project badges are awarded only after customer confirmation.</p>
            </div>
            <Link to="/reviews" className="relative mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 lg:mt-0">
              <ShieldCheck size={17} /> Read or Leave a Review <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
