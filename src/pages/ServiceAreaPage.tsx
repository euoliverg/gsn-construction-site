import { usePageTitle } from "../lib/usePageTitle";
import ServiceArea from "../components/ServiceArea";

export default function ServiceAreaPage() {
  usePageTitle(
    "Service Area",
    "GSN Construction LLC serves Seattle, Washington and the surrounding Puget Sound communities."
  );
  return <ServiceArea />;
}
