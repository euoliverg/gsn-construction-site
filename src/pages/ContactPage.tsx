import { usePageTitle } from "../lib/usePageTitle";
import { EstimateFormSection } from "../components/EstimateForm";
import FAQ from "../components/FAQ";

export default function ContactPage() {
  usePageTitle(
    "Contact",
    "Request a free estimate from GSN Construction LLC. Tell us about your project and we'll get back to you shortly."
  );
  return (
    <>
      <EstimateFormSection />
      <FAQ />
    </>
  );
}
