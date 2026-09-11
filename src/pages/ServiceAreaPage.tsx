import { usePageTitle } from "../lib/usePageTitle";
import ServiceArea from "../components/ServiceArea";

export default function ServiceAreaPage() {
  usePageTitle("Service Area");
  return <ServiceArea />;
}
