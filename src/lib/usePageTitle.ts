import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "GSN Construction LLC";
const SITE_URL = "https://gsnconstructionllc.com";
const DEFAULT_TITLE = `${SITE_NAME} | Construction & Home Improvement in Seattle, WA`;

function setMeta(selector: string, attribute: "href" | "content", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attribute, value);
}

export function usePageTitle(title?: string, description?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

    // Each page needs its own canonical/og:url — otherwise every page
    // declares itself a duplicate of the homepage and search engines drop
    // them from the index.
    const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[name="twitter:title"]', "content", document.title);

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title, description, pathname]);
}
