"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MarketingPage } from "@/components/hex/landing/marketing-page";
import {
  LandingShell,
  useLandingActions,
} from "@/components/hex/landing/landing-shell";
import { getProduct, isProductSlug } from "@/lib/products";

function ProductDetailActions({ kind }: { kind: "docs" | "sheets" | "slides" | "pdf" }) {
  const { getStarted, createNew } = useLandingActions();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={getStarted}
        className="hex-landing-btn-outline inline-flex h-[50px] items-center justify-center rounded-[9px] px-6 text-[15px] font-medium transition-colors"
      >
        Open file
      </button>
      <button
        type="button"
        onClick={() => void createNew(kind)}
        className="hex-landing-btn-accent inline-flex h-[50px] items-center justify-center rounded-[9px] px-6 text-[15px] font-semibold transition-opacity hover:opacity-90"
      >
        New {kind === "docs" ? "document" : kind === "sheets" ? "spreadsheet" : kind === "slides" ? "presentation" : "PDF"}
      </button>
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
          <Link href="/product" className="underline underline-offset-2">
            View all products
          </Link>
        </p>
        <ProductDetailActions kind={product.kind} />
      </MarketingPage>
    </LandingShell>
  );
}
