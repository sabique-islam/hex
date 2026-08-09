"use client";

import { MarketingPage } from "@/components/hex/landing/marketing-page";
import { LandingShell } from "@/components/hex/landing/landing-shell";

export default function AboutPage() {
  return (
    <LandingShell>
      <MarketingPage
        title="About"
        lead="Hex is built for people who live in documents."
      >
        <p>
          We are building an AI-native document workspace that runs in the
          browser: open a file, edit it in place, and take it with you when you
          leave.
        </p>
        <p>
          Hex combines document editing, spreadsheet tooling, presentation
          layout, and PDF intelligence under one roof so you spend less time
          converting files and more time working with them.
        </p>
        <p>
          The project is open source. Explore the code, report issues, and
          contribute on GitHub.
        </p>
      </MarketingPage>
    </LandingShell>
  );
}
