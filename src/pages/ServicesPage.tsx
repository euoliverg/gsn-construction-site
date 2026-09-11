import { usePageTitle } from "../lib/usePageTitle";
import Services from "../components/Services";
import ServiceSelector from "../components/ServiceSelector";
import Process from "../components/Process";

export default function ServicesPage() {
  usePageTitle(
    "Services",
    "Roofing, bathroom remodeling, flooring, interior and exterior painting, landscaping, door and window installation throughout Seattle and surrounding areas."
  );
  return (
    <>
      <Services />
      <ServiceSelector />
      <Process />
    </>
  );
}
