"use client";

import Link from "next/link";
import { LandingHero } from "@/components/hex/landing/landing-hero";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function HomeHero() {
  const { getStarted } = useLandingActions();
  return <LandingHero onGetStarted={getStarted} />;
}

export default function HomePage() {
  return (
    <LandingShell>
      <HomeHero />

      <section className="mx-auto mt-24 w-full max-w-[1430px] px-6 pb-8 sm:px-8 lg:px-10">
        <Separator className="mb-16" />
        <p className="text-[15px] text-muted-foreground">
          Open an existing file or create a blank document, spreadsheet,
          presentation, or PDF in Hex.
        </p>
        <HomeActions />
      </section>
    </LandingShell>
  );
}

function HomeActions() {
  const { getStarted } = useLandingActions();
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button
        type="button"
        size="lg"
        onClick={getStarted}
        className="h-[50px] rounded-[9px] px-6 text-[15px] font-semibold"
      >
        Get started
      </Button>
    </div>
  );
}
