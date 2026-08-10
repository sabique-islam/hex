import type { BentoFeatureId } from "@/components/hex/landing/features-bento-data";
import { cn } from "@/lib/utils";

const ASCII: Record<BentoFeatureId, string[]> = {
  documents: [
    "┌────────────┐",
    "│▓▓▓▓▓▓▓▓▓▓▓▓│",
    "│────────────│",
    "│░░░░░░░░░░░░│",
    "│░░░░░░░░    │",
    "└────────────┘",
  ],
  spreadsheets: [
    "  A B C D  ",
    "┌─┬─┬─┬─┐",
    "│▓│ │▓│ │",
    "├─┼─┼─┼─┤",
    "│ │▓│▓│Σ│",
    "└─┴─┴─┴─┘",
  ],
  presentations: [
    "┌────────────┐",
    "│ ▓▓▓▓▓▓▓▓▓  │",
    "│            │",
    "│  ────────  │",
    "│  ░░░░░░░░  │",
    "└────────────┘",
  ],
  pdf: [
    "┌────────────┐",
    "│▓▓▓▓▓▓▓▓▓▓▓▓│",
    "│▒▒▒▒▒▒▒▒▒▒▒▒│",
    "│▒▒▒▒▒▒▒▒▒▒▒▒│",
    "│▒▒▒▒▒▒▒▒▒▒▒▒│",
    "└────────────┘",
  ],
  local: [
    "   ┌───────┐   ",
    "  ╱         ╲  ",
    " │  ░░░░░░░  │ ",
    " │  ▓  ●  ▓  │ ",
    " │  ░░░░░░░  │ ",
    "  ╲         ╱  ",
    "   └───────┘   ",
  ],
  ai: [
    " ·  ·  ·  ·  ",
    "  ╭────────╮ ",
    "  │▓▓▓▓▓▓▓▓│ ",
    "  │░→ ▓▓▓▓ │ ",
    "  │░→ ▓▓▓▓ │ ",
    "  ╰────────╯ ",
    " ·  ·  ·  ·  ",
  ],
};

const CHAR_W = 9;
const CHAR_H = 14;
const FONT_SIZE = 11;
const PAD = 6;

function padLines(lines: string[]): string[] {
  const cols = Math.max(...lines.map((line) => [...line].length));
  return lines.map((line) => {
    const chars = [...line];
    while (chars.length < cols) chars.push(" ");
    return chars.join("");
  });
}

function isBorderChar(char: string) {
  return "┌┐└┘├┤┬┴┼─│╭╮╰╯╱╲".includes(char);
}

export function BentoArt({
  id,
  className,
}: {
  id: BentoFeatureId;
  className?: string;
}) {
  const lines = padLines(ASCII[id]);
  const cols = [...lines[0]].length;
  const rows = lines.length;
  const width = cols * CHAR_W + PAD * 2;
  const height = rows * CHAR_H + PAD * 2;

  const cells: { char: string; col: number; row: number; border: boolean }[] =
    [];

  lines.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (char === " ") return;
      cells.push({
        char,
        col,
        row,
        border: isBorderChar(char),
      });
    });
  });

  // Draw fills first, borders last so edges stay crisp.
  cells.sort((a, b) => Number(a.border) - Number(b.border));

  return (
    <div className={cn("hex-bento-art", className)} aria-hidden>
      <svg
        className="hex-bento-art-ascii"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        focusable="false"
      >
        <defs>
          <clipPath id={`hex-bento-clip-${id}`}>
            <rect width={width} height={height} />
          </clipPath>
        </defs>
        <g
          clipPath={`url(#hex-bento-clip-${id})`}
          fill="currentColor"
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: FONT_SIZE,
          }}
        >
          {cells.map(({ char, col, row }) => (
            <text
              key={`${row}-${col}`}
              x={PAD + col * CHAR_W + CHAR_W / 2}
              y={PAD + row * CHAR_H + CHAR_H * 0.72}
              textAnchor="middle"
              lengthAdjust="spacingAndGlyphs"
              textLength={CHAR_W * 0.9}
            >
              {char}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
