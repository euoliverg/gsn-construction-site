import { useEffect } from "react";

const SITE_NAME = "GSN Construction LLC";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Construction & Home Improvement in Seattle, WA`;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title]);
}
