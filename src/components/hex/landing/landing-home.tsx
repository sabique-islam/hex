"use client";

import { FeaturesBento } from "@/components/hex/landing/features-bento";
import { LandingFooter } from "@/components/hex/landing/landing-footer";
import { LandingHero } from "@/components/hex/landing/landing-hero";

export function LandingHome({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <>
      <LandingHero onGetStarted={onGetStarted} />
      <FeaturesBento />
      <LandingFooter />
    </>
  );
}
