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
    <ul className="mt-6 space-y-2">
      {TEMPLATES.map(({ label, kind }) => (
        <li key={kind}>
          <button
            type="button"
            onClick={() => void createNew(kind)}
            className="hex-marketing-card flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground"
          >
            {label}
            <span className="text-xs font-normal text-muted-foreground">New</span>
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
