import { BentoCard } from "@/components/hex/landing/bento-card";
import {
  BENTO_FEATURES,
  BENTO_GRID_AREAS,
} from "@/components/hex/landing/features-bento-data";
import { HalftoneZone } from "@/components/hex/landing/halftone-zone";
import { LandingSection } from "@/components/hex/landing/landing-section";

export function FeaturesBento() {
  return (
    <LandingSection
      id="features"
      className="hex-features"
      title="One workspace for every format"
      lead="Generate, edit, and export documents locally, with the same browser across docs, sheets, slides, and PDF."
    >
      <HalftoneZone variant="section" fadeBottom />
      <div
        className="hex-bento"
        style={{ gridTemplateAreas: BENTO_GRID_AREAS }}
      >
        {BENTO_FEATURES.map((feature) => (
          <BentoCard key={feature.id} feature={feature} />
        ))}
      </div>
    </LandingSection>
  );
}
