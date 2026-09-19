import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileStickyBar from "./MobileStickyBar";
import FloatingCallButton from "./FloatingCallButton";

const ChatWidget = lazy(() => import("./ChatWidget"));

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingCallButton />
      <Suspense fallback={null}><ChatWidget /></Suspense>
      <MobileStickyBar />
      <div className="lg:hidden h-[68px]" aria-hidden="true" />
    </>
  );
}
