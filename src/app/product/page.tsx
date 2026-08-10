"use client";

import Link from "next/link";
import { PRODUCT_ITEMS } from "@/lib/products";
import {
  MarketingPage,
  MarketingSection,
} from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { SplitPrimaryButton } from "@/components/hex/landing/split-cta";

function ProductActions() {
  const { getStarted } = useLandingActions();
  return (
    <div className="mt-6">
      <SplitPrimaryButton label="Get started" onClick={getStarted} />
    </div>
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
          Generate, edit, redesign, and collaborate across formats without
          switching apps or uploading to a cloud drive.
        </p>

        <MarketingSection>
          <ul className="space-y-2">
            {PRODUCT_ITEMS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  className="hex-marketing-card block px-4 py-3.5 no-underline"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <ProductActions />
        </MarketingSection>
      </MarketingPage>
    </LandingShell>
  );
}
