import { ServiceSelectionProvider } from "./context/ServiceSelectionContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Services from "./components/Services";
import ServiceSelector from "./components/ServiceSelector";
import ProjectGallery from "./components/ProjectGallery";
import Transformations from "./components/Transformations";
import WhyChooseGSN from "./components/WhyChooseGSN";
import About from "./components/About";
import Process from "./components/Process";
import ServiceArea from "./components/ServiceArea";
import MidCTA from "./components/MidCTA";
import { EstimateFormSection } from "./components/EstimateForm";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import MobileStickyBar from "./components/MobileStickyBar";
import FloatingCallButton from "./components/FloatingCallButton";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <ServiceSelectionProvider>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <ServiceSelector />
        <ProjectGallery />
        <Transformations />
        <WhyChooseGSN />
        <About />
        <Process />
        <ServiceArea />
        <MidCTA />
        <EstimateFormSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCallButton />
      <ChatWidget />
      <MobileStickyBar />
      <div className="lg:hidden h-[68px]" aria-hidden="true" />
    </ServiceSelectionProvider>
  );
}
