import type { ReactNode } from "react";
import { HalftoneZone } from "@/components/hex/landing/halftone-zone";

export function MarketingPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="hex-marketing-frame">
      <HalftoneZone variant="marketing" />
      <main className="hex-marketing-main">
        <h1 className="hex-marketing-title">{title}</h1>
        {lead ? <p className="hex-marketing-lead">{lead}</p> : null}
        <div className="hex-marketing-body">{children}</div>
      </main>
    </div>
  );
}

export function MarketingSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `hex-marketing-section ${className}` : "hex-marketing-section"}>
      {children}
    </div>
  );
}
