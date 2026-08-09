"use client";

import { MarketingPage } from "@/components/hex/landing/marketing-page";
import { LandingShell } from "@/components/hex/landing/landing-shell";

export default function WhyHexPage() {
  return (
    <LandingShell>
      <MarketingPage
        title="Why Hex"
        lead="Documents should be editable everywhere, not locked inside a single format."
      >
        <p>
          Most tools treat PDFs, decks, and scans as finished artifacts. Hex
          treats them as structured canvases you can change element by element.
        </p>
        <p>
          Local-first by default: files stay in your browser. No account
          required to open, edit, or export.
        </p>
        <p>
          One chrome across docs, sheets, slides, and PDF so switching formats
          feels like switching tabs, not switching products.
        </p>
        <p>
          AI-assisted redesign and editing when you need to turn research into
          decks, contracts into working documents, or scans into editable text.
        </p>
      </MarketingPage>
    </LandingShell>
  );
}
