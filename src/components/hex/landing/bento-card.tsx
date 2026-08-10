import type { CSSProperties } from "react";
import Link from "next/link";
import { BentoArt } from "@/components/hex/landing/bento-art";
import type { BentoFeature } from "@/components/hex/landing/features-bento-data";
import { cn } from "@/lib/utils";

export function BentoCard({ feature }: { feature: BentoFeature }) {
  const body = (
    <>
      <div className="hex-bento-card-art">
        <BentoArt id={feature.id} />
      </div>
      <div className="hex-bento-card-body">
        <h3 className="hex-bento-card-title">{feature.title}</h3>
        <p className="hex-bento-card-desc">{feature.description}</p>
        {feature.href ? (
          <span className="hex-bento-card-link" aria-hidden>
            Learn more →
          </span>
        ) : null}
      </div>
    </>
  );

  const className = cn(
    "hex-bento-card",
    `hex-bento-card--${feature.id}`,
    feature.href && "hex-bento-card--linked",
  );

  const style: CSSProperties = { gridArea: feature.area };

  if (feature.href) {
    return (
      <Link href={feature.href} className={className} style={style}>
        {body}
      </Link>
    );
  }

  return (
    <article className={className} style={style}>
      {body}
    </article>
  );
}
