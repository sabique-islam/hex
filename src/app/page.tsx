"use client";

import { LandingHome } from "@/components/hex/landing/landing-home";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";

function HomePageContent() {
  const { getStarted } = useLandingActions();
  return <LandingHome onGetStarted={getStarted} />;
}

export default function HomePage() {
  return (
    <LandingShell>
      <HomePageContent />
    </LandingShell>
  );
}
