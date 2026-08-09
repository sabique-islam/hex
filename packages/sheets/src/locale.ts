import { LocaleType, Tools } from "@univerjs/core";

// Univer requires the `locales` map to be populated for the chosen LocaleType.
// Passing only `locale: EN_US` without strings makes LocaleService throw
// "Locale not initialized" on first render.
//
// Pattern mirrors suite/sheets/apps/web/src/locale.ts and the CasualSheets
// embed-runtime bundle — merge EN_US strings from every plugin we may register.

import UniverUIEnUS from "@univerjs/ui/locale/en-US";
import UniverDocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import UniverSheetsEnUS from "@univerjs/sheets/locale/en-US";
import UniverSheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import UniverSheetsFormulaEnUS from "@univerjs/sheets-formula/locale/en-US";
import UniverSheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
import UniverSheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
import UniverSheetsSortUIEnUS from "@univerjs/sheets-sort-ui/locale/en-US";
import UniverSheetsFilterUIEnUS from "@univerjs/sheets-filter-ui/locale/en-US";
import UniverFindReplaceEnUS from "@univerjs/find-replace/locale/en-US";
import UniverSheetsConditionalFormattingUIEnUS from "@univerjs/sheets-conditional-formatting-ui/locale/en-US";
import UniverDataValidationEnUS from "@univerjs/data-validation/locale/en-US";
import UniverSheetsDataValidationEnUS from "@univerjs/sheets-data-validation/locale/en-US";
import UniverSheetsDataValidationUIEnUS from "@univerjs/sheets-data-validation-ui/locale/en-US";
import UniverSheetsFilterEnUS from "@univerjs/sheets-filter/locale/en-US";
import UniverSheetsHyperLinkEnUS from "@univerjs/sheets-hyper-link/locale/en-US";
import UniverSheetsTableEnUS from "@univerjs/sheets-table/locale/en-US";
import UniverSheetsHyperLinkUIEnUS from "@univerjs/sheets-hyper-link-ui/locale/en-US";
import UniverSheetsNoteUIEnUS from "@univerjs/sheets-note-ui/locale/en-US";
import UniverSheetsTableUIEnUS from "@univerjs/sheets-table-ui/locale/en-US";
import UniverThreadCommentUIEnUS from "@univerjs/thread-comment-ui/locale/en-US";
import UniverSheetsThreadCommentUIEnUS from "@univerjs/sheets-thread-comment-ui/locale/en-US";
import UniverDrawingUIEnUS from "@univerjs/drawing-ui/locale/en-US";
import UniverSheetsDrawingUIEnUS from "@univerjs/sheets-drawing-ui/locale/en-US";

const enUS = Tools.deepMerge(
  {},
  UniverUIEnUS,
  UniverDocsUIEnUS,
  UniverSheetsEnUS,
  UniverSheetsUIEnUS,
  UniverSheetsFormulaEnUS,
  UniverSheetsFormulaUIEnUS,
  UniverSheetsNumfmtUIEnUS,
  UniverSheetsSortUIEnUS,
  UniverSheetsFilterUIEnUS,
  UniverFindReplaceEnUS,
  UniverSheetsConditionalFormattingUIEnUS,
  UniverDataValidationEnUS,
  UniverSheetsDataValidationEnUS,
  UniverSheetsDataValidationUIEnUS,
  UniverSheetsFilterEnUS,
  UniverSheetsHyperLinkEnUS,
  UniverSheetsTableEnUS,
  UniverSheetsHyperLinkUIEnUS,
  UniverSheetsNoteUIEnUS,
  UniverSheetsTableUIEnUS,
  UniverThreadCommentUIEnUS,
  UniverSheetsThreadCommentUIEnUS,
  UniverDrawingUIEnUS,
  UniverSheetsDrawingUIEnUS,
  {
    "sheets-numfmt-ui": {
      info: {
        error: "Error",
        forceStringInfo: "Number stored as text",
      },
    },
  },
);

export const LOCALES = {
  [LocaleType.EN_US]: enUS,
};
