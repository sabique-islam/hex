"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { HalftoneZone } from "@/components/hex/landing/halftone-zone";
import { HexPreviewTeaser } from "@/components/hex/landing/hex-preview";
import { LogoCarousel } from "@/components/hex/landing/logo-carousel";
import {
  OutlineLink,
  SplitPrimaryButton,
} from "@/components/hex/landing/split-cta";
import { Button } from "@/components/ui/button";

const SETUP_CMD = "hex damn is this fr";

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 10.5h-1a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CommandPill() {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SETUP_CMD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="hex-hero-command">
      <span className="hex-hero-command-text">
        <span className="hex-hero-command-prefix" aria-hidden>
          ${" "}
        </span>
        {SETUP_CMD}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copied ? "Copied" : "Copy command"}
        onClick={() => void onCopy()}
        className="ml-auto size-7 shrink-0 text-[#a1a1aa] hover:bg-black/[0.04] hover:text-[#52525b]"
      >
        {copied ? "✓" : <CopyIcon />}
      </Button>
    </div>
  );
}

export function LandingHero({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <div className="hex-home">
      <section className="hex-hero">
        <HalftoneZone variant="hero" fadeBottom />

        <div className="hex-hero-inner">
          <Link href="/create/presentation" className="hex-hero-badge">
            <span className="hex-hero-badge-icon" aria-hidden>
              <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="9"
                  rx="0"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 7h6M5 9.5h4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="hex-hero-badge-divider" aria-hidden />
            <span className="hex-hero-badge-tag">New</span>
            <span className="hex-hero-badge-text">
              AI presentation studio is live
            </span>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="size-3 shrink-0 opacity-45"
              aria-hidden
            >
              <path
                d="M2.5 6h7M6.5 3.5 9 6l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <h1 className="hex-hero-title">
            Make every document editable
            <span className="hex-hero-title-accent">.</span>
          </h1>

          <p className="hex-hero-subtitle">
            Generate, edit, and collaborate on any document in your browser.
            PDFs, decks, scans. Fully editable, stored locally.
          </p>

          <div className="hex-hero-actions">
            <SplitPrimaryButton label="Get started" onClick={onGetStarted} />
            <OutlineLink label="Browse templates" href="/templates" />
          </div>

          <CommandPill />

          <div className="hex-hero-proof">
            <p className="hex-hero-proof-label">Works with every format</p>
            <LogoCarousel />
          </div>
        </div>
      </section>

      <HexPreviewTeaser />
    </div>
  );
}
