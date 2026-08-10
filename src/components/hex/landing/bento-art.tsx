import type { BentoFeatureId } from "@/components/hex/landing/features-bento-data";
import { cn } from "@/lib/utils";

const ASCII: Record<BentoFeatureId, string> = {
  documents: `
┌────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓│
│────────────│
│░░░░░░░░░░░░│
│░░░░░░░░    │
└────────────┘`.trim(),
  spreadsheets: `
  A B C D
┌─┬─┬─┬─┐
│▓│ │▓│ │
├─┼─┼─┼─┤
│ │▓│▓│Σ│
└─┴─┴─┴─┘`.trim(),
  presentations: `
┌────────────┐
│ ▓▓▓▓▓▓▓▓▓ │
│            │
│  ────────  │
│  ░░░░░░░░  │
└────────────┘
 ○ ○ ● ○`.trim(),
  pdf: `
┌────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓│
│▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒│
└────────────┘`.trim(),
  local: `
   ┌─────┐
  ╱       ╲
 │ ▓▓▓▓▓▓▓ │
 │ ▓  ●  ▓ │
 │ ▓▓▓▓▓▓▓ │
  ╲       ╱
   └─────┘`.trim(),
  ai: `
 ·  ·  ·  ·
  ╭────────╮
  │▓▓▓▓▓▓▓▓│
  │░→ ▓▓▓▓│
  │░→ ▓▓▓▓│
  ╰────────╯
 ·  ·  ·  ·`.trim(),
};

export function BentoArt({
  id,
  className,
}: {
  id: BentoFeatureId;
  className?: string;
}) {
  return (
    <div className={cn("hex-bento-art", className)} aria-hidden>
      <pre className="hex-bento-art-ascii">{ASCII[id]}</pre>
    </div>
  );
}
