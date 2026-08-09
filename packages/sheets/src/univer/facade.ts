/**
 * Facade extension side-effect imports — each module mutates FUniver /
 * FWorkbook / FWorksheet prototypes to add domain methods (e.g. addTable,
 * createFilter, sort). Order doesn't matter; importing twice is a no-op.
 */
import "@univerjs/sheets/facade";
import "@univerjs/sheets-ui/facade";
import "@univerjs/sheets-formula/facade";
import "@univerjs/sheets-numfmt/facade";
import "@univerjs/sheets-sort/facade";
import "@univerjs/sheets-filter/facade";
import "@univerjs/sheets-table/facade";
import "@univerjs/docs-ui/facade";
import "@univerjs/ui/facade";
import "@univerjs/engine-formula/facade";
