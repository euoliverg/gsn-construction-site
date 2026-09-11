import { usePageTitle } from "../lib/usePageTitle";
import About from "../components/About";

export default function AboutPage() {
  usePageTitle("About Us");
  return <About />;
}
