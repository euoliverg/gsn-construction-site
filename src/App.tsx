import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ServiceSelectionProvider } from "./context/ServiceSelectionContext";
import { ChatProvider } from "./context/ChatContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ServiceAreaPage from "./pages/ServiceAreaPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <ServiceSelectionProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="service-area" element={<ServiceAreaPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </ServiceSelectionProvider>
  );
}
