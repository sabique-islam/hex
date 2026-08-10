import type { ReactNode } from "react";
import { HalftoneFlank } from "@/components/hex/landing/halftone-flank";
import { cn } from "@/lib/utils";

export type HalftoneVariant = "hero" | "section" | "marketing";

export function HalftoneZone({
  variant = "section",
  sides = "both",
  fadeBottom = false,
  className,
  children,
}: {
  variant?: HalftoneVariant;
  sides?: "both" | "left" | "right";
  fadeBottom?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "hex-halftone-zone",
        `hex-halftone-zone--${variant}`,
        fadeBottom && "hex-halftone-zone--fade-bottom",
        className,
      )}
      aria-hidden={!children}
    >
      {(sides === "both" || sides === "left") && <HalftoneFlank side="left" />}
      {(sides === "both" || sides === "right") && <HalftoneFlank side="right" />}
      {children}
    </div>
  );
}
