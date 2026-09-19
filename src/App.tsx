import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ServiceSelectionProvider } from "./context/ServiceSelectionContext";
import { ChatProvider } from "./context/ChatContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ServiceAreaPage from "./pages/ServiceAreaPage";
import ContactPage from "./pages/ContactPage";

const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));

export default function App() {
  return (
    // Router wraps the providers so they can navigate (picking a service
    // sends the visitor to the estimate form on /contact) while still
    // keeping their state across route changes.
    <BrowserRouter>
      <ServiceSelectionProvider>
        <ChatProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="service-area" element={<ServiceAreaPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="reviews" element={<Suspense fallback={<div className="min-h-[70vh] bg-gray-50" />}><ReviewsPage /></Suspense>} />
              {/* Any unknown URL (the host serves index.html for everything)
                  lands on the homepage instead of a blank page. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ChatProvider>
      </ServiceSelectionProvider>
    </BrowserRouter>
  );
}
