import { usePageTitle } from "../lib/usePageTitle";
import About from "../components/About";

export default function AboutPage() {
  usePageTitle(
    "About Us",
    "GSN Construction LLC is led by Gilberto da Silva Neto, working directly with Seattle-area homeowners on construction and home improvement projects."
  );
  return <About />;
}
