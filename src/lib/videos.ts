export interface ProjectVideo {
  id: string;
  title: string;
  description: string;
  src: string;
  poster: string;
}

export const PROJECT_VIDEOS: ProjectVideo[] = [
  {
    id: "roofing-crew-install",
    title: "Commercial Roof Installation",
    description: "Our crew installing a full commercial roof system, panel by panel.",
    src: "/videos/roofing-crew-install.mp4",
    poster: "/videos/roofing-crew-install.jpg",
  },
  {
    id: "exterior-lift-work",
    title: "Exterior & Roofline Work",
    description: "Working the roofline on a commercial building exterior.",
    src: "/videos/exterior-lift-work.mp4",
    poster: "/videos/exterior-lift-work.jpg",
  },
  {
    id: "roof-tear-off",
    title: "Roof Tear-Off & Deck Repair",
    description: "Stripping a worn roof down to the deck before a fresh install.",
    src: "/videos/roof-tear-off.mp4",
    poster: "/videos/roof-tear-off.jpg",
  },
];
