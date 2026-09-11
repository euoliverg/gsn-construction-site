import { Link } from "react-router-dom";
import { Phone, FileText } from "lucide-react";
import { PHONE_NUMBERS } from "../lib/constants";

export default function MobileStickyBar() {
  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-8px_24px_-12px_rgba(7,24,43,0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-px bg-gray-100">
        {PHONE_NUMBERS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            aria-label={`Call GSN Construction at ${p.label}`}
            className="flex flex-col items-center justify-center gap-0.5 bg-white py-3 text-navy-900 active:bg-gray-50"
          >
            <Phone size={16} className="text-blue-600" />
            <span className="text-[11px] font-bold leading-none whitespace-nowrap">{p.label}</span>
          </a>
        ))}
        <Link
          to="/contact"
          className="flex items-center justify-center gap-2 bg-blue-600 py-4 text-sm font-bold text-white active:bg-blue-700"
        >
          <FileText size={17} />
          GET ESTIMATE
        </Link>
      </div>
    </div>
  );
}
