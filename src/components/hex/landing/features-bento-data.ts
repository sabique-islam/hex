export type BentoFeatureId =
  | "documents"
  | "spreadsheets"
  | "presentations"
  | "pdf"
  | "local"
  | "ai";

export type BentoFeature = {
  id: BentoFeatureId;
  title: string;
  description: string;
  href?: string;
  area: string;
};

export const BENTO_FEATURES: BentoFeature[] = [
  {
    id: "documents",
    title: "Documents",
    description:
      "Edit DOCX with formatting, tables, and headers. Export back to Word-compatible files.",
    href: "/product/documents",
    area: "docs",
  },
  {
    id: "spreadsheets",
    title: "Spreadsheets",
    description: "XLSX, CSV, and ODS with formulas, charts, and cell editing.",
    href: "/product/spreadsheets",
    area: "sheets",
  },
  {
    id: "presentations",
    title: "Presentations",
    description: "Import PPTX decks, edit slides in place, and export updated files.",
    href: "/product/presentations",
    area: "slides",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Annotate, edit text, redact, and fill forms without leaving the browser.",
    href: "/product/pdf",
    area: "pdf",
  },
  {
    id: "local",
    title: "Local-first",
    description:
      "Files stay on your device in browser storage until you download them. No account required.",
    area: "local",
  },
  {
    id: "ai",
    title: "AI presentation studio",
    description:
      "Generate decks from a prompt with Presenton, then refine every slide in Hex.",
    href: "/create/presentation",
    area: "ai",
  },
];

export const BENTO_GRID_AREAS = `
  "docs docs sheets slides"
  "docs docs pdf local"
  "ai ai ai ai"
`;
