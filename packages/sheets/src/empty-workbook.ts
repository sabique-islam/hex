import type { IWorkbookData } from "@univerjs/core";
import { LocaleType } from "@univerjs/core";

const INITIAL_ROWS = 1024;
const INITIAL_COLUMNS = 26;

/** Blank workbook snapshot for a new Hex spreadsheet. */
export function emptyWorkbook(): IWorkbookData {
  const nowIso = new Date().toISOString();
  return {
    id: `wb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    rev: 1,
    name: "Untitled",
    appVersion: "0.25.0",
    locale: LocaleType.EN_US,
    styles: {},
    sheetOrder: ["sheet-1"],
    sheets: {
      "sheet-1": {
        id: "sheet-1",
        name: "Sheet1",
        cellData: {},
        rowCount: INITIAL_ROWS,
        columnCount: INITIAL_COLUMNS,
      },
    },
    custom: {
      properties: { createdAt: nowIso, modifiedAt: nowIso },
    },
  };
}
