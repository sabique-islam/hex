import type { EditorKind } from "@/lib/kinds";

export type PreviewKind = EditorKind;

export const PREVIEW_TABS: {
  kind: PreviewKind;
  label: string;
  fileName: string;
}[] = [
  { kind: "docs", label: "Documents", fileName: "Quarterly update.docx" },
  { kind: "sheets", label: "Spreadsheets", fileName: "Budget tracker.xlsx" },
  { kind: "slides", label: "Presentations", fileName: "Product launch.pptx" },
  { kind: "pdf", label: "PDF", fileName: "Contract draft.pdf" },
];
