"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { getProduct, isProductSlug } from "@/lib/products";
import { Button } from "@/components/ui/button";

function ProductDetailActions({ kind }: { kind: "docs" | "sheets" | "slides" | "pdf" }) {
  const { getStarted, createNew } = useLandingActions();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={getStarted}
        className="h-[50px] rounded-[9px] px-6 text-[15px] font-medium"
      >
        Open file
      </Button>
      <Button
        type="button"
        size="lg"
        onClick={() => void createNew(kind)}
        className="h-[50px] rounded-[9px] px-6 text-[15px] font-semibold"
      >
        New {kind === "docs" ? "document" : kind === "sheets" ? "spreadsheet" : kind === "slides" ? "presentation" : "PDF"}
      </Button>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  if (!isProductSlug(slug)) notFound();

  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <LandingShell>
      <MarketingPage title={product.label} lead={product.description}>
        {product.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          <Button
            variant="link"
            className="h-auto p-0 text-muted-foreground"
            nativeButton={false}
            render={<Link href="/product" />}
          >
            View all products
          </Button>
        </p>
        <ProductDetailActions kind={product.kind} />
      </MarketingPage>
    </LandingShell>
  );
}
