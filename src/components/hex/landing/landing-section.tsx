import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LandingSection({
  id,
  className,
  innerClassName,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("hex-landing-section", className)}>
      <div className={cn("hex-landing-section-inner", innerClassName)}>
        {(eyebrow || title || lead) && (
          <header className="hex-landing-section-header">
            {eyebrow ? (
              <p className="hex-landing-section-eyebrow">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="hex-landing-section-title">{title}</h2>
            ) : null}
            {lead ? <p className="hex-landing-section-lead">{lead}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
