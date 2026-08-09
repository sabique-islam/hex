"use client";

import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

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
          <Card
            size="sm"
            className="rounded-[9px] py-0 transition-colors hover:bg-accent"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => void createNew(kind)}
              className="h-auto w-full justify-between rounded-[9px] px-4 py-3 text-[15px] font-medium hover:bg-transparent"
            >
              <CardTitle className="text-[15px] font-medium">{label}</CardTitle>
              <CardDescription className="text-[13px]">New</CardDescription>
            </Button>
          </Card>
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
