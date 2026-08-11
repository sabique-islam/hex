import { LocaleType, type ICellData, type IWorkbookData } from "@univerjs/core";
import { xlsxToWorkbookData } from "@casualoffice/sheets/xlsx";

const INITIAL_ROWS = 1024;
const INITIAL_COLUMNS = 26;

function extensionFromName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

type TabularFormat = "csv" | "tsv" | "ods";

async function readWorkbook(buffer: ArrayBuffer, format: TabularFormat) {
  const XLSX = await import("@e965/xlsx");
  if (format === "csv") {
    const text = new TextDecoder().decode(buffer);
    return XLSX.read(text, { type: "string" });
  }
  if (format === "tsv") {
    const text = new TextDecoder().decode(buffer);
    return XLSX.read(text, { type: "string", FS: "\t" });
  }
  return XLSX.read(buffer, { type: "array" });
}

async function tabularToWorkbookData(
  buffer: ArrayBuffer,
  format: TabularFormat,
): Promise<IWorkbookData> {
  const wb = await readWorkbook(buffer, format);
  const id = `wb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const sheetOrder: string[] = [];
  const sheets: IWorkbookData["sheets"] = {};

  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    const sheetId = `sheet-${sheetOrder.length + 1}`;
    sheetOrder.push(sheetId);

    if (!sheet || !sheet["!ref"]) {
      sheets[sheetId] = {
        id: sheetId,
        name,
        cellData: {},
        rowCount: INITIAL_ROWS,
        columnCount: INITIAL_COLUMNS,
      };
      continue;
    }

    const XLSX = await import("@e965/xlsx");
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const cellData: Record<number, Record<number, ICellData>> = {};
    let maxRow = 0;
    let maxCol = 0;

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = sheet[addr];
        if (!cell) continue;
        const cd: ICellData = {};
        if (cell.v !== undefined && cell.v !== null) {
          if (cell.v instanceof Date) {
            cd.v = cell.v.toISOString();
          } else if (
            typeof cell.v === "number" ||
            typeof cell.v === "string" ||
            typeof cell.v === "boolean"
          ) {
            cd.v = cell.v;
          } else {
            cd.v = String(cell.v);
          }
        }
        if (typeof cell.f === "string" && cell.f.length > 0) {
          cd.f = cell.f.startsWith("=") ? cell.f : `=${cell.f}`;
        }
        if (cd.v === undefined && cd.f === undefined) continue;
        (cellData[r] ??= {})[c] = cd;
        maxRow = Math.max(maxRow, r);
        maxCol = Math.max(maxCol, c);
      }
    }

    sheets[sheetId] = {
      id: sheetId,
      name,
      cellData,
      rowCount: Math.max(INITIAL_ROWS, maxRow + 1),
      columnCount: Math.max(INITIAL_COLUMNS, maxCol + 1),
    };
  }

  if (sheetOrder.length === 0) {
    sheetOrder.push("sheet-1");
    sheets["sheet-1"] = {
      id: "sheet-1",
      name: "Sheet1",
      cellData: {},
      rowCount: INITIAL_ROWS,
      columnCount: INITIAL_COLUMNS,
    };
  }

  return {
    id,
    rev: 1,
    name: "Imported",
    appVersion: "0.25.0",
    locale: LocaleType.EN_US,
    styles: {},
    sheetOrder,
    sheets,
  };
}

/** Load spreadsheet bytes by filename extension (xlsx, csv, tsv, ods, …). */
export async function workbookFromBytes(
  name: string,
  bytes: ArrayBuffer,
): Promise<IWorkbookData> {
  const ext = extensionFromName(name);
  switch (ext) {
    case "xlsx":
    case "xlsm":
    case "xls":
      return xlsxToWorkbookData(bytes);
    case "csv":
      return tabularToWorkbookData(bytes, "csv");
    case "tsv":
    case "tab":
      return tabularToWorkbookData(bytes, "tsv");
    case "ods":
      return tabularToWorkbookData(bytes, "ods");
    default:
      return xlsxToWorkbookData(bytes);
  }
}
