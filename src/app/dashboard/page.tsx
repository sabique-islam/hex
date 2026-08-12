"use client";

import { FilesDashboard } from "@/components/hex/dashboard/files-dashboard";
import { MarketingPage } from "@/components/hex/landing/marketing-page";
import { LandingShell } from "@/components/hex/landing/landing-shell";

export default function DashboardPage() {
  return (
    <LandingShell>
      <MarketingPage
        title="Files"
        lead="Everything you've opened in Hex on this device."
      >
        <FilesDashboard />
      </MarketingPage>
    </LandingShell>
  );
}
