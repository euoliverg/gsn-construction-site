import {
  PaintRoller,
  Trees,
  DoorOpen,
  AppWindow,
  LayoutGrid,
  ShowerHead,
  Home,
  type LucideIcon,
} from "lucide-react";

export const BUSINESS = {
  name: "GSN Construction LLC",
  contractor: "Gilberto da Silva Neto",
  phone: "(425) 269-9024",
  phoneHref: "tel:+14252699024",
  phone2: "(425) 770-0937",
  phone2Href: "tel:+14257700937",
  email: "dkgge@hotmail.com",
  region: "Seattle, Washington & Surrounding Areas",
};

export const PHONE_NUMBERS = [
  { label: BUSINESS.phone, href: BUSINESS.phoneHref },
  { label: BUSINESS.phone2, href: BUSINESS.phone2Href },
];

export type ServiceId =
  | "roofing"
  | "bathroom"
  | "flooring"
  | "painting-interior"
  | "painting-exterior"
  | "landscaping"
  | "doors"
  | "windows"
  | "multiple"
  | "other";

export interface ServiceDef {
  id: ServiceId;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "painting-interior",
    name: "Interior & Exterior Painting",
    short: "Painting",
    description:
      "Professional painting services designed to refresh, protect and transform your property.",
    icon: PaintRoller,
  },
  {
    id: "landscaping",
    name: "Landscaping",
    short: "Landscaping",
    description:
      "Outdoor improvements and landscaping solutions to create cleaner, more functional and attractive spaces.",
    icon: Trees,
  },
  {
    id: "doors",
    name: "Door Installation",
    short: "Doors",
    description:
      "Professional door installation and replacement for improved security, functionality and appearance.",
    icon: DoorOpen,
  },
  {
    id: "windows",
    name: "Window Installation",
    short: "Windows",
    description:
      "Window installation and replacement designed to improve comfort, efficiency and curb appeal.",
    icon: AppWindow,
  },
  {
    id: "flooring",
    name: "Flooring",
    short: "Flooring",
    description:
      "Professional flooring installation and upgrades for residential interiors.",
    icon: LayoutGrid,
  },
  {
    id: "bathroom",
    name: "Bathroom Remodeling",
    short: "Bathroom",
    description:
      "Bathroom improvements and remodeling focused on functionality, comfort and modern design.",
    icon: ShowerHead,
  },
  {
    id: "roofing",
    name: "Roofing",
    short: "Roofing",
    description:
      "Roofing services to help protect your property from Washington's demanding weather conditions.",
    icon: Home,
  },
];

export const SELECTOR_OPTIONS: { id: ServiceId; label: string }[] = [
  { id: "roofing", label: "Roofing" },
  { id: "bathroom", label: "Bathroom" },
  { id: "flooring", label: "Flooring" },
  { id: "painting-interior", label: "Painting" },
  { id: "landscaping", label: "Landscaping" },
  { id: "doors", label: "Doors" },
  { id: "windows", label: "Windows" },
  { id: "multiple", label: "Multiple Services" },
  { id: "other", label: "Other Project" },
];

export const FORM_SERVICE_OPTIONS: { id: ServiceId; label: string }[] = [
  { id: "roofing", label: "Roofing" },
  { id: "bathroom", label: "Bathroom Remodeling" },
  { id: "flooring", label: "Flooring" },
  { id: "painting-interior", label: "Interior Painting" },
  { id: "painting-exterior", label: "Exterior Painting" },
  { id: "landscaping", label: "Landscaping" },
  { id: "doors", label: "Door Installation" },
  { id: "windows", label: "Window Installation" },
  { id: "multiple", label: "Multiple Services" },
  { id: "other", label: "Other" },
];

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#service-area", label: "Service Area" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];
