import { PDFDocument, StandardFonts } from "pdf-lib";

/** Minimal one-page PDF for "New PDF" in Hex. */
export async function createBlankPdfBytes(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText("Untitled", {
    x: 72,
    y: 720,
    size: 18,
    font,
  });
  return doc.save();
}
