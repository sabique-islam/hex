"use client";

import { useState } from "react";
import {
  PREVIEW_TABS,
  type PreviewKind,
} from "@/components/hex/landing/hex-preview-demo-data";
import { SimApp } from "@/components/hex/landing/hex-preview-sim";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<PreviewKind, string> = {
  docs: "Document",
  sheets: "Spreadsheet",
  slides: "Presentation",
  pdf: "PDF",
};

export function HexPreviewFrame({
  className,
  frameClassName,
}: {
  className?: string;
  frameClassName?: string;
}) {
  const [active, setActive] = useState<PreviewKind>("docs");
  const activeTab = PREVIEW_TABS.find((tab) => tab.kind === active)!;

  return (
    <div className={cn("hex-preview", className)} aria-label="Hex editor preview">
      <div className={cn("hex-preview-frame", frameClassName)}>
        <header className="hex-preview-editorbar">
          <div className="hex-preview-editorbar-left">
            <span className="hex-preview-editorbar-logo">Hex</span>
            <span className="hex-preview-editorbar-kind">
              {KIND_LABEL[active]}
            </span>
            <span className="hex-preview-editorbar-name">
              {activeTab.fileName}
            </span>
          </div>
          <div
            className="hex-preview-format"
            role="tablist"
            aria-label="Format"
          >
            {PREVIEW_TABS.map((tab) => (
              <button
                key={tab.kind}
                type="button"
                role="tab"
                aria-selected={active === tab.kind}
                className={cn(
                  "hex-preview-format-btn",
                  active === tab.kind && "hex-preview-format-btn--active",
                )}
                onClick={() => setActive(tab.kind)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="hex-preview-stage" role="tabpanel">
          <SimApp key={active} kind={active} />
        </div>
      </div>
    </div>
  );
}

export function HexPreviewTeaser() {
  return (
    <div className="hex-hero-teaser">
      <HexPreviewFrame
        className="hex-preview--teaser"
        frameClassName="hex-preview-frame--teaser"
      />
    </div>
  );
}
