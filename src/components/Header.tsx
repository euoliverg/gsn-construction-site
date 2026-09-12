import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { BUSINESS, NAV_LINKS, PHONE_NUMBERS } from "../lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Only the homepage opens with the dark hero that the transparent header
  // is designed to sit on top of. Every other page starts on a light
  // section, so the header stays solid there.
  const solid = scrolled || menuOpen || pathname !== "/";

  return (
    <>
    <header
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-navy-900/95 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(4,16,31,0.5)]"
          : "bg-gradient-to-b from-navy-950/80 to-transparent"
      }`}
    >
      {/* Utility strip — contact details live here so the main bar only has
          to carry the logo, the nav and one call to action. Collapses once
          the visitor scrolls, keeping the sticky header compact. */}
      <div
        className={`hidden lg:block overflow-hidden border-b border-white/10 transition-all duration-300 ${
          solid ? "max-h-0 opacity-0 border-transparent" : "max-h-12 opacity-100"
        }`}
      >
        <div className="container-px mx-auto max-w-7xl flex h-10 items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-medium text-blue-100/75">
            <MapPin size={13} className="text-blue-400" />
            {BUSINESS.region}
          </p>
          <div className="flex items-center gap-6">
            {PHONE_NUMBERS.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/80 transition-colors hover:text-blue-300"
              >
                <Phone size={13} strokeWidth={2.4} className="text-blue-400" />
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-px mx-auto max-w-7xl flex items-center gap-6 h-[72px]">
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="GSN Construction LLC home">
          <span className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white shadow-md p-1.5">
            <Logo className="w-full h-full object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display font-bold text-white text-[15px] sm:text-base tracking-tight">
              GSN CONSTRUCTION
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-blue-300 font-semibold mt-1">
              LLC
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-8 xl:gap-10" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? "true" : undefined}
                className={`relative group whitespace-nowrap text-[13.5px] font-semibold tracking-wide transition-colors ${
                  active ? "text-white" : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-0.5 rounded-full bg-blue-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden lg:inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(8,102,217,0.7)] transition-all hover:shadow-[0_10px_28px_-6px_rgba(22,136,255,0.8)] hover:-translate-y-0.5"
        >
          Get a Free Estimate
          <ArrowRight size={15} />
        </Link>

        <button
          type="button"
          className="lg:hidden ml-auto flex items-center justify-center h-11 w-11 rounded-lg text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>

      {/* Mobile menu — deliberately a sibling of <header>, not a child: the
          header's backdrop-blur makes it the containing block for fixed
          descendants, which collapsed this panel to zero height and let the
          page show through behind the links. */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-navy-900 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
        // Sits right under the header, which grows by the notch inset.
        style={{ top: "calc(72px + env(safe-area-inset-top))" }}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === link.href ? "true" : undefined}
              className={`text-lg font-medium py-4 border-b border-white/10 ${
                pathname === link.href ? "text-blue-300" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            {PHONE_NUMBERS.map((p) => (
              <a key={p.href} href={p.href} className="flex items-center gap-2 text-base font-semibold text-blue-300">
                <Phone size={18} /> {p.label}
              </a>
            ))}
          </div>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white"
          >
            Get a Free Estimate
          </Link>
        </nav>
      </div>
    </>
  );
}
