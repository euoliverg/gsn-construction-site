export type ProjectCategory =
  | "Bathroom"
  | "Kitchen"
  | "Fireplace"
  | "Flooring"
  | "Roofing"
  | "Exterior"
  | "Windows";
export type ProjectStatus = "progress" | "completed";

export interface ProjectPhoto {
  id: string;
  src: string;
  category: ProjectCategory;
  status: ProjectStatus;
  title: string;
  width: number;
  height: number;
}

export const CATEGORIES: ProjectCategory[] = [
  "Bathroom",
  "Kitchen",
  "Fireplace",
  "Flooring",
  "Roofing",
  "Exterior",
  "Windows",
];

export const PROJECT_PHOTOS: ProjectPhoto[] = [
  { id: "shower-01", src: "/projects/shower-01.jpeg", category: "Bathroom", status: "completed", title: "Herringbone-tiled corner shower", width: 1200, height: 1600 },
  { id: "shower-30", src: "/projects/shower-30.jpeg", category: "Bathroom", status: "completed", title: "Herringbone shower, full bathroom view", width: 1200, height: 1600 },
  { id: "shower-02", src: "/projects/shower-02.jpeg", category: "Bathroom", status: "progress", title: "Wood-accent shower wall, tub set in place", width: 1200, height: 1600 },
  { id: "shower-03", src: "/projects/shower-03.jpeg", category: "Bathroom", status: "progress", title: "Marble shower with backlit niche", width: 1200, height: 1600 },
  { id: "shower-05", src: "/projects/shower-05.jpeg", category: "Bathroom", status: "progress", title: "Black marble shower — tile install underway", width: 1200, height: 1600 },
  { id: "shower-04", src: "/projects/shower-04.jpeg", category: "Bathroom", status: "progress", title: "Black marble shower — tile complete", width: 1200, height: 1600 },
  { id: "shower-06", src: "/projects/shower-06.jpeg", category: "Bathroom", status: "completed", title: "Glass shower with pebble-stone floor", width: 1200, height: 1600 },
  { id: "shower-07", src: "/projects/shower-07.jpeg", category: "Bathroom", status: "progress", title: "Zellige-style tile tub surround", width: 1200, height: 1600 },
  { id: "bathroom-08", src: "/projects/bathroom-08.jpeg", category: "Bathroom", status: "progress", title: "Leaf-pattern accent wall, double vanity", width: 1200, height: 1600 },
  { id: "shower-09", src: "/projects/shower-09.jpeg", category: "Bathroom", status: "progress", title: "Subway tile shower — early stage", width: 1200, height: 1600 },
  { id: "shower-18", src: "/projects/shower-18.jpeg", category: "Bathroom", status: "progress", title: "Subway tile shower — wide view", width: 1200, height: 1600 },
  { id: "shower-11", src: "/projects/shower-11.jpeg", category: "Bathroom", status: "progress", title: "Hex mosaic shower — early stage", width: 1200, height: 1600 },
  { id: "shower-10", src: "/projects/shower-10.jpeg", category: "Bathroom", status: "progress", title: "Hex mosaic shower with bench", width: 1200, height: 1600 },
  { id: "shower-12", src: "/projects/shower-12.jpeg", category: "Bathroom", status: "progress", title: "Waterproofing membrane, shower rough-in", width: 1200, height: 1600 },
  { id: "shower-14", src: "/projects/shower-14.jpeg", category: "Bathroom", status: "progress", title: "Charcoal tile shower mid-install", width: 1200, height: 1600 },
  { id: "shower-16", src: "/projects/shower-16.jpeg", category: "Bathroom", status: "progress", title: "Wood-look plank tile shower", width: 1200, height: 1600 },
  { id: "shower-19", src: "/projects/shower-19.jpeg", category: "Bathroom", status: "progress", title: "White subway shower mid-tile", width: 1200, height: 1600 },
  { id: "shower-20", src: "/projects/shower-20.jpeg", category: "Bathroom", status: "completed", title: "Shower with glass mosaic accent strip", width: 1200, height: 1600 },
  { id: "shower-21", src: "/projects/shower-21.jpeg", category: "Bathroom", status: "completed", title: "Shower with vertical brick-style tile", width: 1200, height: 1600 },
  { id: "shower-22", src: "/projects/shower-22.jpeg", category: "Bathroom", status: "progress", title: "White subway shower rough-in", width: 1200, height: 1600 },
  { id: "shower-25", src: "/projects/shower-25.jpeg", category: "Bathroom", status: "progress", title: "Subway tile shower rough-in", width: 1200, height: 1600 },
  { id: "bathroom-26", src: "/projects/bathroom-26.jpeg", category: "Bathroom", status: "completed", title: "Freestanding tub with tile accent wall", width: 1200, height: 1600 },
  { id: "shower-28", src: "/projects/shower-28.jpeg", category: "Bathroom", status: "progress", title: "Shower pan mortar bed", width: 1200, height: 1600 },
  { id: "shower-29", src: "/projects/shower-29.jpeg", category: "Bathroom", status: "progress", title: "Shower tile in progress", width: 1200, height: 1600 },
  { id: "shower-31", src: "/projects/shower-31.jpeg", category: "Bathroom", status: "completed", title: "Walk-in shower with dual shower heads", width: 1200, height: 1600 },
  { id: "kitchen-23", src: "/projects/kitchen-23.jpeg", category: "Kitchen", status: "progress", title: "Kitchen cabinets and backsplash install", width: 1600, height: 1200 },
  { id: "kitchen-13", src: "/projects/kitchen-13.jpeg", category: "Kitchen", status: "completed", title: "Finished kitchen with subway tile backsplash", width: 1600, height: 1200 },
  { id: "fireplace-17", src: "/projects/fireplace-17.jpeg", category: "Fireplace", status: "progress", title: "Brick-pattern tile fireplace wall", width: 1200, height: 1600 },
  { id: "fireplace-24", src: "/projects/fireplace-24.jpeg", category: "Fireplace", status: "progress", title: "Fireplace tile installation", width: 1200, height: 1600 },
  { id: "fireplace-15", src: "/projects/fireplace-15.jpeg", category: "Fireplace", status: "progress", title: "Patterned tile fireplace surround", width: 1200, height: 1600 },
  { id: "flooring-27", src: "/projects/flooring-27.jpeg", category: "Flooring", status: "progress", title: "Marble-look flooring installation", width: 1200, height: 1600 },

  { id: "roofing-01", src: "/projects/roofing-01.jpeg", category: "Roofing", status: "progress", title: "Roof re-deck with synthetic underlayment", width: 1600, height: 1200 },
  { id: "roofing-02", src: "/projects/roofing-02.jpeg", category: "Roofing", status: "progress", title: "Underlayment install — hip and ridge prep", width: 1200, height: 1600 },
  { id: "roofing-03", src: "/projects/roofing-03.jpeg", category: "Roofing", status: "completed", title: "Finished shingle roof — ridge cap detail", width: 768, height: 1024 },
  { id: "roofing-04", src: "/projects/roofing-04.jpeg", category: "Roofing", status: "completed", title: "Finished shingle roof — hip and valley", width: 768, height: 1024 },

  { id: "window-01", src: "/projects/window-01.jpeg", category: "Windows", status: "progress", title: "Window opening prepped with weather barrier", width: 1200, height: 1600 },
  { id: "window-02", src: "/projects/window-02.jpeg", category: "Windows", status: "completed", title: "New privacy-glass window, installed and trimmed", width: 1200, height: 1600 },

  { id: "exterior-damage-02", src: "/projects/exterior-damage-02.jpeg", category: "Exterior", status: "progress", title: "Rot damage found behind old siding", width: 1200, height: 1600 },
  { id: "exterior-damage-01", src: "/projects/exterior-damage-01.jpeg", category: "Exterior", status: "progress", title: "Wall opened up for structural repair", width: 1200, height: 1600 },
  { id: "exterior-framing-01", src: "/projects/exterior-framing-01.jpeg", category: "Exterior", status: "progress", title: "New framing and window, ready for siding", width: 1200, height: 1600 },
  { id: "exterior-siding-01", src: "/projects/exterior-siding-01.jpeg", category: "Exterior", status: "completed", title: "Exterior siding and trim — side elevation", width: 1200, height: 1600 },
  { id: "exterior-siding-02", src: "/projects/exterior-siding-02.jpeg", category: "Exterior", status: "completed", title: "Exterior siding and trim — rear corner", width: 1200, height: 1600 },
  { id: "exterior-siding-03", src: "/projects/exterior-siding-03.jpeg", category: "Exterior", status: "completed", title: "Exterior siding and trim — front elevation", width: 1200, height: 1600 },
];

export interface ProgressPair {
  id: string;
  title: string;
  before: string;
  after: string;
}

export const PROGRESS_PAIRS: ProgressPair[] = [
  { id: "onyx-shower", title: "Black Marble Shower — Tile Installation", before: "shower-05", after: "shower-04" },
  { id: "hex-mosaic-shower", title: "Hex Mosaic Shower — Tile Installation", before: "shower-11", after: "shower-10" },
];

/**
 * Featured job shown with the drag-to-compare slider. Both photos must be the
 * same wall from the same vantage point, otherwise dragging the handle reads as
 * a camera jump rather than a change in the work.
 */
export interface FeaturedRepair {
  id: string;
  tag: string;
  title: string;
  description: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  detail: string;
  scope: string[];
}

export const FEATURED_REPAIR: FeaturedRepair = {
  id: "structural-rebuild",
  tag: "Structural Repair",
  title: "What We Find Behind the Siding",
  description:
    "On this job the old siding was hiding rotted sheathing and framing. Rather than cover it back up, the damaged section was cut out and the wall was rebuilt from the studs out.",
  before: "exterior-damage-01",
  after: "exterior-framing-01",
  beforeLabel: "Damage Found",
  afterLabel: "Rebuilt",
  detail: "exterior-damage-02",
  scope: [
    "Rotted sheathing and framing cut out and removed",
    "Damaged studs replaced with new framing lumber",
    "New window unit set into the rebuilt opening",
    "Roof edge kept covered while the wall was open",
    "Wall left square and ready for sheathing and siding",
  ],
};
