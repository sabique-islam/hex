import { cn } from "@/lib/utils";

export type HalftoneSide = "left" | "right";

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
    />
  );
}
