import { Link } from "react-router-dom";
import {
  Home,
  ShowerHead,
  LayoutGrid,
  PaintRoller,
  Trees,
  DoorOpen,
  AppWindow,
  LayoutList,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { SELECTOR_OPTIONS, type ServiceId } from "../lib/constants";
import { useServiceSelection } from "../context/ServiceSelectionContext";
import Reveal from "./Reveal";

const ICONS: Record<ServiceId, typeof Home> = {
  roofing: Home,
  bathroom: ShowerHead,
  flooring: LayoutGrid,
  "painting-interior": PaintRoller,
  "painting-exterior": PaintRoller,
  landscaping: Trees,
  doors: DoorOpen,
  windows: AppWindow,
  multiple: LayoutList,
  other: HelpCircle,
};

export default function ServiceSelector() {
  const { selected, selectAndScroll } = useServiceSelection();

  return (
    <section className="relative bg-navy-900 py-24 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.25]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(22,136,255,0.16),transparent_65%)]" />

      <div className="container-px mx-auto max-w-5xl relative text-center">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400">TELL US MORE</span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl sm:text-4xl text-balance">
            What Can We Help You With?
          </h2>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
            Select a project below and we&apos;ll take you straight to the estimate form.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {SELECTOR_OPTIONS.map((opt) => {
              const Icon = ICONS[opt.id];
              const isActive = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectAndScroll(opt.id)}
                  aria-pressed={isActive}
                  className={`group flex flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-7 transition-all duration-300 ${
                    isActive
                      ? "border-blue-400 bg-blue-500/15 shadow-[0_0_0_1px_rgba(22,136,255,0.4),0_20px_40px_-16px_rgba(22,136,255,0.5)]"
                      : "border-white/10 bg-white/[0.03] hover:border-blue-400/50 hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center h-12 w-12 rounded-xl transition-colors ${
                      isActive ? "bg-blue-500 text-white" : "bg-white/5 text-blue-300 group-hover:bg-blue-500/20"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <span className="text-sm font-semibold text-white/90">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <Link
            to="/contact"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            Or go straight to the estimate form
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
