export type EditorKind = "docs" | "sheets" | "slides" | "pdf";

const EXT_MAP: Record<string, EditorKind> = {
  docx: "docs",
  xlsx: "sheets",
  xlsm: "sheets",
  csv: "sheets",
  tsv: "sheets",
  ods: "sheets",
  pptx: "slides",
  pdf: "pdf",
};

export function kindFromFilename(name: string): EditorKind | null {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return EXT_MAP[ext] ?? null;
}

export function defaultFilename(kind: EditorKind): string {
  switch (kind) {
    case "docs":
      return "Untitled.docx";
    case "sheets":
      return "Untitled.xlsx";
    case "slides":
      return "Untitled.pptx";
    case "pdf":
      return "Untitled.pdf";
  }
}

export function mimeForKind(kind: EditorKind): string {
  switch (kind) {
    case "docs":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "sheets":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "slides":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "pdf":
      return "application/pdf";
  }
}

export function isEditorKind(value: string): value is EditorKind {
  return value === "docs" || value === "sheets" || value === "slides" || value === "pdf";
}

export const ACCEPT_OPEN =
  ".docx,.xlsx,.xlsm,.csv,.tsv,.ods,.pptx,.pdf";
