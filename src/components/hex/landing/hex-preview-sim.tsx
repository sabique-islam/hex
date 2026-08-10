"use client";

import { useCallback, useState } from "react";
import type { PreviewKind } from "@/components/hex/landing/hex-preview-demo-data";
import { cn } from "@/lib/utils";

function IconBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("hex-sim-iconbtn", active && "hex-sim-iconbtn--active")}
    >
      {children}
    </button>
  );
}

function MenuBar({ items }: { items: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <nav className="hex-sim-menubar" aria-label="Menu">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            "hex-sim-menuitem",
            open === item && "hex-sim-menuitem--open",
          )}
          aria-expanded={open === item}
          onClick={() => setOpen((v) => (v === item ? null : item))}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
      <path
        fill="currentColor"
        d="M4 2h4.2a3.2 3.2 0 0 1 2.4 5.4A3.4 3.4 0 0 1 12 11.2V12H4V2zm2 5.2h2a1.2 1.2 0 1 0 0-2.4H6v2.4zm0 2.4v2.8h2.4a1.4 1.4 0 0 0 0-2.8H6z"
      />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
      <path fill="currentColor" d="M7 2h6v2h-2.2L8.2 12H10v2H4v-2h2.2L9.8 4H7V2z" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
      <path
        fill="currentColor"
        d="M5 2h2v5.5a2 2 0 1 0 4 0V2h2v5.5a4 4 0 1 1-8 0V2zm-2 11h10v2H3v-2z"
      />
    </svg>
  );
}

export function SimApp({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "docs":
      return <SimDocs />;
    case "sheets":
      return <SimSheets />;
    case "slides":
      return <SimSlides />;
    case "pdf":
      return <SimPdf />;
    default:
      return null;
  }
}

function SimDocs() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  return (
    <div className="hex-sim hex-sim--docs">
      <MenuBar items={["File", "Edit", "Insert", "Format", "View"]} />
      <div className="hex-sim-toolbar">
        <IconBtn label="Bold" active={bold} onClick={() => setBold((v) => !v)}>
          <BoldIcon />
        </IconBtn>
        <IconBtn
          label="Italic"
          active={italic}
          onClick={() => setItalic((v) => !v)}
        >
          <ItalicIcon />
        </IconBtn>
        <IconBtn
          label="Underline"
          active={underline}
          onClick={() => setUnderline((v) => !v)}
        >
          <UnderlineIcon />
        </IconBtn>
        <span className="hex-sim-toolbar-sep" />
        <select className="hex-sim-select" defaultValue="11" aria-label="Font size">
          <option value="11">11</option>
          <option value="14">14</option>
          <option value="18">18</option>
        </select>
        <select className="hex-sim-select hex-sim-select--wide" defaultValue="Arial" aria-label="Font">
          <option>Arial</option>
          <option>Inter</option>
          <option>Georgia</option>
        </select>
      </div>
      <div className="hex-sim-docs-canvas">
        <div className="hex-sim-page">
          <h3
            className={cn(
              "hex-sim-docs-title",
              bold && "font-bold",
              italic && "italic",
              underline && "underline",
            )}
            contentEditable
            suppressContentEditableWarning
          >
            Quarterly product update
          </h3>
          <p
            className={cn(
              "hex-sim-docs-body",
              bold && "font-bold",
              italic && "italic",
              underline && "underline",
            )}
            contentEditable
            suppressContentEditableWarning
          >
            Hex turns PDFs, decks, and scans into fully editable documents in your
            browser. Select text and use the toolbar, or click and type.
          </p>
          <ul className="hex-sim-docs-list">
            <li contentEditable suppressContentEditableWarning>
              Import DOCX, XLSX, PPTX, or PDF from your device
            </li>
            <li contentEditable suppressContentEditableWarning>
              Edit locally with no account required
            </li>
            <li contentEditable suppressContentEditableWarning>
              Export back to the original format when you are done
            </li>
          </ul>
          <p
            className={cn(
              "hex-sim-docs-body",
              bold && "font-bold",
              italic && "italic",
              underline && "underline",
            )}
            contentEditable
            suppressContentEditableWarning
          >
            Use the format switcher above to preview spreadsheets, slides, and PDF
            editing in the same workspace chrome.
          </p>
        </div>
      </div>
    </div>
  );
}

const INITIAL_GRID: string[][] = [
  ["Category", "Q1", "Q2", "Sum"],
  ["Engineering", "42000", "48000", "90000"],
  ["Marketing", "18000", "22000", "40000"],
  ["Operations", "12000", "14000", "26000"],
  ["Support", "9000", "11000", "20000"],
  ["Design", "8000", "9500", "17500"],
  ["Sales", "22000", "26000", "48000"],
  ["Legal", "5000", "5200", "10200"],
  ["Total", "", "", "251700"],
];

function cellRef(ri: number, ci: number) {
  return `${String.fromCharCode(65 + ci)}${ri + 1}`;
}

function SimSheets() {
  const [grid, setGrid] = useState(INITIAL_GRID);
  const [selected, setSelected] = useState("1-1");
  const [formula, setFormula] = useState("42000");

  const onSelect = useCallback((key: string, value: string, ri: number, ci: number) => {
    setSelected(key);
    setFormula(value);
  }, []);

  const onFormulaCommit = useCallback(() => {
    const [ri, ci] = selected.split("-").map(Number);
    if (Number.isNaN(ri) || Number.isNaN(ci)) return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[ri]![ci] = formula;
      return next;
    });
  }, [formula, selected]);

  const displayValue = (value: string, ri: number, ci: number) => {
    if (ri === 0 || (ri === 8 && ci === 0)) return value;
    if (!value) return "";
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toLocaleString();
  };

  return (
    <div className="hex-sim hex-sim--sheets">
      <MenuBar items={["Edit", "Insert", "Format", "Data", "View"]} />
      <div className="hex-sim-formula">
        <span className="hex-sim-formula-name">
          {(() => {
            const [ri, ci] = selected.split("-").map(Number);
            return Number.isNaN(ri) || Number.isNaN(ci) ? "B2" : cellRef(ri, ci);
          })()}
        </span>
        <span className="hex-sim-formula-label">fx</span>
        <input
          className="hex-sim-formula-input"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onBlur={onFormulaCommit}
          onKeyDown={(e) => e.key === "Enter" && onFormulaCommit()}
          aria-label="Formula bar"
        />
      </div>
      <div className="hex-sim-grid-wrap">
        <table className="hex-sim-grid">
          <thead>
            <tr>
              <th className="hex-sim-grid-head" />
              {["A", "B", "C", "D"].map((col) => (
                <th key={col} className="hex-sim-grid-head">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                <th className="hex-sim-grid-rowhead">{ri + 1}</th>
                {row.map((value, ci) => {
                  const key = `${ri}-${ci}`;
                  return (
                    <td key={key}>
                      <button
                        type="button"
                        className={cn(
                          "hex-sim-cell",
                          selected === key && "hex-sim-cell--selected",
                          ri === 0 && "hex-sim-cell--header",
                          ri === 8 && "hex-sim-cell--total",
                        )}
                        onClick={() => onSelect(key, value, ri, ci)}
                      >
                        {displayValue(value, ri, ci)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hex-sim-sheet-tabs">
        <button type="button" className="hex-sim-sheet-tab hex-sim-sheet-tab--active">
          Overview
        </button>
        <button type="button" className="hex-sim-sheet-tab">
          Forecast
        </button>
      </div>
    </div>
  );
}

const SLIDES = [
  { title: "Launch day", sub: "Click to edit slides in Hex" },
  { title: "Roadmap", sub: "Documents · Spreadsheets · Presentations · PDF" },
  { title: "Metrics", sub: "Track adoption, retention, and export volume" },
  { title: "Next steps", sub: "Share decks, export PDFs, and collaborate locally" },
];

function SimSlides() {
  const [slide, setSlide] = useState(0);

  return (
    <div className="hex-sim hex-sim--slides">
      <div className="hex-sim-slides-titlebar">
        <MenuBar items={["File", "Edit", "View", "Insert"]} />
      </div>
      <div className="hex-sim-toolbar">
        <IconBtn label="Bold">
          <BoldIcon />
        </IconBtn>
        <IconBtn label="Italic">
          <ItalicIcon />
        </IconBtn>
        <span className="hex-sim-toolbar-sep" />
        <select className="hex-sim-select hex-sim-select--wide" defaultValue="Inter" aria-label="Font">
          <option>Inter</option>
          <option>Arial</option>
        </select>
        <select className="hex-sim-select" defaultValue="32" aria-label="Font size">
          <option value="32">32</option>
          <option value="24">24</option>
        </select>
      </div>
      <div className="hex-sim-slides-body">
        <div className="hex-sim-slides-rail">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "hex-sim-slide-thumb",
                slide === i && "hex-sim-slide-thumb--active",
              )}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            >
              <span className="hex-sim-slide-thumb-num">{i + 1}</span>
            </button>
          ))}
        </div>
        <div className="hex-sim-slide-stage">
          <div className="hex-sim-slide-canvas">
            <h3
              className="hex-sim-slide-title"
              contentEditable
              suppressContentEditableWarning
            >
              {SLIDES[slide]!.title}
            </h3>
            <p
              className="hex-sim-slide-sub"
              contentEditable
              suppressContentEditableWarning
            >
              {SLIDES[slide]!.sub}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PDF_PAGES = [
  {
    title: "Service agreement",
    lines: [
      "This agreement is entered into between Hex Labs and the counterparty named below.",
      "Payment shall be due within thirty (30) days of invoice. Late fees may apply after the grace period.",
      "Either party may terminate with thirty days written notice.",
      "All deliverables must meet the acceptance criteria defined in Exhibit B.",
      "Support response times are outlined in the service level agreement.",
    ],
    highlightable: [1, 3],
  },
  {
    title: "Appendix A",
    lines: [
      "Confidential information must not be disclosed without prior written consent.",
      "Data processing shall comply with applicable privacy regulations.",
      "Sub-processors require written approval from both parties.",
      "Audit rights apply on thirty days notice, no more than once per year.",
    ],
    highlightable: [0],
  },
];

function SimPdf() {
  const [page, setPage] = useState(0);
  const [tool, setTool] = useState<"select" | "highlight">("select");
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});

  const toggleHighlight = (pageIdx: number, lineIdx: number) => {
    if (tool !== "highlight") return;
    const key = `${pageIdx}-${lineIdx}`;
    setHighlights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const current = PDF_PAGES[page]!;

  return (
    <div className="hex-sim hex-sim--pdf">
      <div className="hex-sim-pdf-toolbar">
        <IconBtn
          label="Select"
          active={tool === "select"}
          onClick={() => setTool("select")}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path
              d="M3 2l9 6.5-3.5.5L7 14 5.5 9 3 2z"
              fill="currentColor"
            />
          </svg>
        </IconBtn>
        <IconBtn
          label="Highlight"
          active={tool === "highlight"}
          onClick={() => setTool("highlight")}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path
              d="M3 12h10v2H3v-2zm1.5-8L12 7.5l-2 2L4.5 6l-2-2z"
              fill="currentColor"
            />
          </svg>
        </IconBtn>
        <IconBtn label="Text">
          <span className="text-[11px] font-semibold">T</span>
        </IconBtn>
      </div>
      <div className="hex-sim-pdf-body">
        <div className="hex-sim-pdf-sidebar">
          {PDF_PAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "hex-sim-pdf-thumb",
                page === i && "hex-sim-pdf-thumb--active",
              )}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="hex-sim-pdf-page">
          <p className="hex-sim-pdf-heading">{current.title}</p>
          {current.lines.map((line, li) => (
            <p key={li} className="hex-sim-pdf-line">
              <button
                type="button"
                className={cn(
                  "hex-sim-pdf-linebtn",
                  highlights[`${page}-${li}`] && "hex-sim-pdf-mark",
                  tool === "highlight" && "hex-sim-pdf-linebtn--highlight-mode",
                )}
                onClick={() => toggleHighlight(page, li)}
              >
                {line}
              </button>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
