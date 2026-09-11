import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS, PHONE_NUMBERS } from "../lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever nav section is currently in view, so the menu always
  // reflects where you actually are on the page.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Prefer the one closest to the top of the viewport.
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActiveHref(`#${topMost.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-navy-900/95 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(4,16,31,0.5)]"
          : "bg-gradient-to-b from-navy-950/70 to-transparent"
      }`}
    >
      <div className="container-px mx-auto max-w-7xl flex items-center justify-between h-[72px]">
        <a href="#home" className="flex items-center gap-3 shrink-0" aria-label="GSN Construction LLC home">
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
        </a>

        <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "true" : undefined}
                className={`text-sm font-medium transition-colors relative group ${
                  active ? "text-white" : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-blue-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-4 divide-x divide-white/15">
          {PHONE_NUMBERS.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="flex items-center gap-2 pl-4 first:pl-0 text-sm font-semibold text-white/90 hover:text-blue-300 transition-colors"
            >
              <Phone size={16} strokeWidth={2.4} />
              {p.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(8,102,217,0.7)] transition-all hover:shadow-[0_10px_28px_-6px_rgba(22,136,255,0.8)] hover:-translate-y-0.5"
          >
            Get a Free Estimate
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden flex items-center justify-center h-11 w-11 rounded-lg text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 bg-navy-900 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
        style={{ top: "72px" }}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={activeHref === link.href ? "true" : undefined}
              className={`text-lg font-medium py-4 border-b border-white/10 ${
                activeHref === link.href ? "text-blue-300" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            {PHONE_NUMBERS.map((p) => (
              <a key={p.href} href={p.href} className="flex items-center gap-2 text-base font-semibold text-blue-300">
                <Phone size={18} /> {p.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white"
          >
            Get a Free Estimate
          </a>
        </nav>
      </div>
    </header>
  );
}
