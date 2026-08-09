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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ProductActions() {
  const { getStarted } = useLandingActions();
  return (
    <Button
      type="button"
      size="lg"
      onClick={getStarted}
      className="mt-8 h-[50px] rounded-[9px] px-6 text-[15px] font-semibold"
    >
      Get started
    </Button>
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

        <MarketingSection>
          <ul className="space-y-4">
            {PRODUCT_ITEMS.map((item) => (
              <li key={item.slug}>
                <Card
                  size="sm"
                  className="rounded-[9px] py-0 transition-colors hover:bg-accent"
                >
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-[9px] px-4 py-4 text-left hover:bg-transparent"
                    nativeButton={false}
                    render={<Link href={item.href} className="block w-full" />}
                  >
                    <CardHeader className="gap-1 px-0">
                      <CardTitle className="text-[17px] font-semibold">
                        {item.label}
                      </CardTitle>
                      <CardDescription className="text-[14px]">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Button>
                </Card>
              </li>
            ))}
          </ul>

          <ProductActions />
        </MarketingSection>
      </MarketingPage>
    </LandingShell>
  );
}
