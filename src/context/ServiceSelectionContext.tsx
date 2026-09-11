import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ServiceId } from "../lib/constants";

interface ServiceSelectionValue {
  selected: ServiceId | null;
  selectAndScroll: (id: ServiceId) => void;
}

const ServiceSelectionContext = createContext<ServiceSelectionValue | null>(null);

export function ServiceSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectAndScroll = useCallback(
    (id: ServiceId) => {
      setSelected(id);
      // The estimate form lives on its own page now, so picking a service
      // takes the visitor there (it already scrolls to top on arrival).
      // If they're somehow already on /contact, just scroll the form in.
      if (pathname !== "/contact") {
        navigate("/contact");
        return;
      }
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [navigate, pathname]
  );

  return (
    <ServiceSelectionContext.Provider value={{ selected, selectAndScroll }}>
      {children}
    </ServiceSelectionContext.Provider>
  );
}

export function useServiceSelection() {
  const ctx = useContext(ServiceSelectionContext);
  if (!ctx) throw new Error("useServiceSelection must be used within ServiceSelectionProvider");
  return ctx;
}
