"use client";

import { PresentationStudio } from "@/components/hex/presenton/presentation-studio";
import { LandingShell } from "@/components/hex/landing/landing-shell";

export default function CreatePresentationPage() {
  return (
    <LandingShell>
      <PresentationStudio />
    </LandingShell>
  );
}
