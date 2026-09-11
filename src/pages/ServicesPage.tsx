import { usePageTitle } from "../lib/usePageTitle";
import Services from "../components/Services";
import ServiceSelector from "../components/ServiceSelector";
import Process from "../components/Process";

export default function ServicesPage() {
  usePageTitle("Services");
  return (
    <>
      <Services />
      <ServiceSelector />
      <Process />
    </>
  );
}
