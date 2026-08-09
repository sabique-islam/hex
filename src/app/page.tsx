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

      <section className="mx-auto mt-24 w-full max-w-[1430px] px-6 pb-8 sm:px-8 lg:px-10">
        <div className="border-t border-[var(--landing-border)] pt-16">
          <p className="text-[15px] text-[var(--landing-muted)]">
            Open an existing file from your device, or start with a blank
            document in Hex.
          </p>
          <HomeActions />
        </div>
      </section>
    </LandingShell>
  );
}

function HomeActions() {
  const { getStarted, createNew } = useLandingActions();
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={getStarted}
        className="hex-landing-btn-outline inline-flex h-[50px] items-center justify-center rounded-[9px] px-6 text-[15px] font-medium transition-colors"
      >
        Open file
      </button>
      <button
        type="button"
        onClick={() => void createNew("docs")}
        className="hex-landing-btn-accent inline-flex h-[50px] items-center justify-center rounded-[9px] px-6 text-[15px] font-semibold transition-opacity hover:opacity-90"
      >
        New document
      </button>
    </div>
  );
}
