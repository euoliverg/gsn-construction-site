import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AdminApp from "./admin/AdminApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
);
