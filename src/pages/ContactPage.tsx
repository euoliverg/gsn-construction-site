import { usePageTitle } from "../lib/usePageTitle";
import { EstimateFormSection } from "../components/EstimateForm";
import FAQ from "../components/FAQ";

export default function ContactPage() {
  usePageTitle("Contact");
  return (
    <>
      <EstimateFormSection />
      <FAQ />
    </>
  );
}
