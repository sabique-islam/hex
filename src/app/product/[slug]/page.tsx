"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { getProduct, isProductSlug } from "@/lib/products";
import {
  OutlineButton,
  SplitPrimaryButton,
} from "@/components/hex/landing/split-cta";

function ProductDetailActions({ kind }: { kind: "docs" | "sheets" | "slides" | "pdf" }) {
  const { getStarted, createNew, generateSlides } = useLandingActions();
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <OutlineButton label="Open file" onClick={getStarted} />
      {kind === "slides" ? (
        <SplitPrimaryButton label="Design with AI" onClick={generateSlides} />
      ) : null}
      <SplitPrimaryButton
        label={
          kind === "docs"
            ? "New document"
            : kind === "sheets"
              ? "New spreadsheet"
              : kind === "slides"
                ? "New presentation"
                : "New PDF"
        }
        onClick={() => void createNew(kind)}
      />
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
          <Link href="/product" className="text-sm font-medium text-primary hover:underline">
            View all products
          </Link>
        </p>
        <ProductDetailActions kind={product.kind} />
      </MarketingPage>
    </LandingShell>
  );
}
