import type { EditorKind } from "@/lib/kinds";

export type ProductSlug = "documents" | "spreadsheets" | "presentations" | "pdf";

export type ProductItem = {
  slug: ProductSlug;
  label: string;
  description: string;
  href: `/product/${ProductSlug}`;
  kind: EditorKind;
  body: string[];
};

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    slug: "documents",
    label: "Documents",
    description: "DOCX editing with formatting, tables, and export",
    href: "/product/documents",
    kind: "docs",
    body: [
      "Write and edit DOCX files in the browser with a full formatting toolbar, tables, headers, and export back to Word-compatible files.",
      "Files stay on your device in local storage until you download them.",
    ],
  },
  {
    slug: "spreadsheets",
    label: "Spreadsheets",
    description: "XLSX | CSV | ODS with formulas and charts",
    href: "/product/spreadsheets",
    kind: "sheets",
    body: [
      "Open spreadsheets, edit cells, use formulas, and export to XLSX or CSV.",
      "Hex uses the same workspace chrome as every other format so switching from a doc to a sheet feels native.",
    ],
  },
  {
    slug: "presentations",
    label: "Presentations",
    description: "PPTX decks with slide editing and export",
    href: "/product/presentations",
    kind: "slides",
    body: [
      "Import PPTX decks, edit slides in place, and export updated presentations.",
      "Generate new decks from a prompt with Presenton AI, then edit them in Hex.",
    ],
  },
  {
    slug: "pdf",
    label: "PDF",
    description: "Annotate, edit text, redact, and fill forms",
    href: "/product/pdf",
    kind: "pdf",
    body: [
      "Annotate, edit text, redact sensitive content, and fill forms without leaving the browser.",
      "PDFs remain fully local: open from your device, edit, then download the updated file.",
    ],
  },
];

export function isProductSlug(value: string): value is ProductSlug {
  return PRODUCT_ITEMS.some((item) => item.slug === value);
}

export function getProduct(slug: string): ProductItem | undefined {
  return PRODUCT_ITEMS.find((item) => item.slug === slug);
}
