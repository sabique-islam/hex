"use client";

import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";

const TEMPLATES = [
  { label: "Blank document", kind: "docs" as const },
  { label: "Blank spreadsheet", kind: "sheets" as const },
  { label: "Blank presentation", kind: "slides" as const },
  { label: "Blank PDF", kind: "pdf" as const },
];

function TemplateList() {
  const { createNew } = useLandingActions();
  return (
    <ul className="mt-8 space-y-3">
      {TEMPLATES.map(({ label, kind }) => (
        <li key={kind}>
          <button
            type="button"
            onClick={() => void createNew(kind)}
            className="hex-landing-card flex w-full items-center justify-between rounded-[9px] px-4 py-3 text-left text-[15px] font-medium text-[var(--landing-fg)] transition-colors"
          >
            <span>{label}</span>
            <span className="text-[13px] font-normal text-[var(--landing-muted)]">
              New
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function TemplatesPage() {
  return (
    <LandingShell>
      <MarketingPage
        title="Templates"
        lead="Start from a blank file in any Hex format."
      >
        <p>
          Pick a template below to create a new local file and open it in the
          editor immediately.
        </p>
        <TemplateList />
      </MarketingPage>
    </LandingShell>
  );
}
