import { usePageTitle } from "../lib/usePageTitle";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import WhyChooseGSN from "../components/WhyChooseGSN";
import MidCTA from "../components/MidCTA";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyChooseGSN />
      <MidCTA />
      <FinalCTA />
    </>
  );
}
