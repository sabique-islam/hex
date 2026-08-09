"use client";

import Link from "next/link";
import { PRODUCT_ITEMS } from "@/lib/products";
import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";

function ProductActions() {
  const { getStarted } = useLandingActions();
  return (
    <button
      type="button"
      onClick={getStarted}
      className="hex-landing-btn-accent mt-8 inline-flex h-[50px] items-center justify-center rounded-[9px] px-6 text-[15px] font-semibold transition-opacity hover:opacity-90"
    >
      Get started
    </button>
  );
}

export default function ProductPage() {
  return (
    <LandingShell>
      <MarketingPage
        title="Product"
        lead="Hex is a browser-native workspace for documents that need to stay editable."
      >
        <p>
          Open PDF, PPTX, DOCX, XLSX, and scans in one place. Edit locally,
          export when you are done, and keep files on your device.
        </p>
        <p>
          Generate | Edit | Redesign | Collaborate across formats without
          switching apps or uploading to a cloud drive.
        </p>

        <ul className="mt-12 space-y-4 border-t border-[var(--landing-border)] pt-10">
          {PRODUCT_ITEMS.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.href}
                className="hex-landing-card group block rounded-[9px] px-4 py-4 transition-colors"
              >
                <span className="block text-[17px] font-semibold text-[var(--landing-fg)]">
                  {item.label}
                </span>
                <span className="mt-1 block text-[14px] text-[var(--landing-muted)]">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ProductActions />
      </MarketingPage>
    </LandingShell>
  );
}
