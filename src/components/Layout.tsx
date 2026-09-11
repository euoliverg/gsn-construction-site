import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileStickyBar from "./MobileStickyBar";
import FloatingCallButton from "./FloatingCallButton";
import ChatWidget from "./ChatWidget";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingCallButton />
      <ChatWidget />
      <MobileStickyBar />
      <div className="lg:hidden h-[68px]" aria-hidden="true" />
    </>
  );
}
