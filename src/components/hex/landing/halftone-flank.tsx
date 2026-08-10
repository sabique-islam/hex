import { cn } from "@/lib/utils";

export type HalftoneSide = "left" | "right";

type Dot = {
  x: number;
  y: number;
  r: number;
  fill: string;
};

const VIEW_W = 480;
const VIEW_H = 860;

const COLORS = {
  blue: [0, 87, 255] as const,
  cyan: [34, 211, 238] as const,
  violet: [139, 92, 246] as const,
  yellow: [250, 204, 21] as const,
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickColor(rand: () => number): { rgb: readonly [number, number, number]; o: number } {
  const roll = rand();
  if (roll < 0.012) {
    return { rgb: COLORS.yellow, o: 0.22 + rand() * 0.28 };
  }
  if (roll < 0.12) {
    return { rgb: COLORS.cyan, o: 0.22 + rand() * 0.34 };
  }
  if (roll < 0.22) {
    return { rgb: COLORS.violet, o: 0.2 + rand() * 0.32 };
  }
  return { rgb: COLORS.blue, o: 0.32 + rand() * 0.48 };
}

function generateTriangleDots(count: number, seed: number): Dot[] {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];
  let attempts = 0;

  while (dots.length < count && attempts < count * 40) {
    attempts += 1;
    const x = rand() * VIEW_W;
    const y = rand() * VIEW_H;
    const yn = y / VIEW_H;

    // Soft triangular envelope: full on the outer edge (x=0), tapering inward.
    // Jitter the hypotenuse so it reads random, not a hard clip.
    const maxInward =
      (0.1 + yn * 0.52 + (rand() - 0.5) * 0.05) * VIEW_W;
    if (x > maxInward) continue;

    const edgeT = x / Math.max(maxInward, 1);
    if (rand() > (1 - edgeT) ** 1.6 * (0.5 + yn * 0.5)) continue;

    const { rgb, o } = pickColor(rand);
    dots.push({
      x,
      y,
      r: 1.1 + rand() * 1.8,
      fill: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${o})`,
    });
  }

  return dots;
}

const DOTS = generateTriangleDots(480, 0x1e3c01);

export function HalftoneFlank({
  side,
  className,
}: {
  side: HalftoneSide;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hex-halftone-flank",
        side === "left" ? "hex-halftone-flank--left" : "hex-halftone-flank--right",
        className,
      )}
      aria-hidden
    >
      <svg
        className="hex-halftone-flank-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio={
          side === "left" ? "xMinYMid slice" : "xMaxYMid slice"
        }
        focusable="false"
      >
        <g transform={side === "right" ? `translate(${VIEW_W} 0) scale(-1 1)` : undefined}>
          {DOTS.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={dot.fill}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
