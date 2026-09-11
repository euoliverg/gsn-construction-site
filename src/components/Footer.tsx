import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import Logo from "./Logo";
import { BUSINESS, NAV_LINKS, PHONE_NUMBERS } from "../lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white/60 pt-16 pb-8">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-11 w-11 rounded-xl bg-white p-1.5">
                <Logo className="w-full h-full object-contain" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-white text-sm tracking-tight">
                  GSN CONSTRUCTION
                </span>
                <span className="text-[10px] tracking-[0.25em] text-blue-300 font-semibold mt-1">LLC</span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed">
              Construction &amp; Home Improvement
              <br />
              {BUSINESS.region}
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white text-sm tracking-wide">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white text-sm tracking-wide">Contact</h3>
            <ul className="mt-5 space-y-3">
              {PHONE_NUMBERS.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                    <Phone size={15} />
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors break-all"
                >
                  <Mail size={15} />
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white text-sm tracking-wide">Get a Free Estimate</h3>
            <p className="mt-5 text-sm leading-relaxed">
              Ready to start your project? Reach out today and we&apos;ll get back to you shortly.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all"
            >
              Get a Free Estimate
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {year} GSN Construction LLC. All Rights Reserved.</p>
          <p>Seattle, Washington</p>
        </div>
      </div>
    </footer>
  );
}
