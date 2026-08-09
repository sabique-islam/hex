"use client";

import { LandingHero } from "@/components/hex/landing/landing-hero";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";

function HomeHero() {
  const { getStarted } = useLandingActions();
  return <LandingHero onGetStarted={getStarted} />;
}

export default function HomePage() {
  return (
    <LandingShell>
      <HomeHero />
    </LandingShell>
  );
}
