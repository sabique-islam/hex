"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { HexLogo } from "@/components/hex/hex-logo";
import { Button } from "@/components/ui/button";
import { defaultFilename } from "@/lib/kinds";
import {
  PRESENTON_IDEA_CHIPS,
  PRESENTON_SLIDE_COUNTS,
  PRESENTON_TEMPLATE_CATEGORIES,
  PRESENTON_TEMPLATES,
  type PresentonTemplateCategory,
} from "@/lib/presenton/templates";
import type { PresentonGenerateResponse } from "@/lib/presenton/types";
import { cn } from "@/lib/utils";
import { newFileId, putFile } from "@/lib/storage";

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 14l.8 2.6L21.5 17l-2.7.8L18 20.5l-.8-2.7L14.5 17l2.7-.8L18 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PresentationStudio() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("general");
  const [nSlides, setNSlides] = useState<number>(8);
  const [category, setCategory] =
    useState<PresentonTemplateCategory>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (category === "all") return PRESENTON_TEMPLATES;
    return PRESENTON_TEMPLATES.filter((item) => item.category === category);
  }, [category]);

  const selectedTemplate = useMemo(
    () => PRESENTON_TEMPLATES.find((item) => item.id === template),
    [template],
  );

  const handleGenerate = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Describe your presentation to get started.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/presenton/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          template,
          nSlides,
        }),
      });

      const payload = (await res.json()) as
        | PresentonGenerateResponse
        | { error?: string };

      if (!res.ok) {
        throw new Error(
          "error" in payload && payload.error
            ? payload.error
            : "Generation failed",
        );
      }

      const result = payload as PresentonGenerateResponse;
      const id = newFileId();
      const bytes = base64ToArrayBuffer(result.bytesBase64);
      const name = result.fileName || defaultFilename("slides");

      await putFile({ id, kind: "slides", name, bytes });
      router.push(`/editor/slides?id=${encodeURIComponent(id)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not generate presentation",
      );
      setLoading(false);
    }
  }, [nSlides, prompt, router, template]);

  return (
    <div className="hex-presentation-studio relative min-h-[100dvh] bg-background">
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-border bg-card">
              <SparkleIcon className="size-7 animate-pulse text-foreground" />
            </div>
            <p className="text-[22px] font-semibold tracking-tight">
              Creating your presentation
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Hex is generating slides with the{" "}
              <span className="text-foreground">{selectedTemplate?.label}</span>{" "}
              style. This usually takes a minute.
            </p>
          </div>
        </div>
      ) : null}

      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-9 px-3 text-[14px] text-muted-foreground hover:text-foreground"
            nativeButton={false}
            render={<Link href="/" />}
          >
            ← Home
          </Button>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <Link
            href="/"
            className="hidden items-center gap-2 text-[15px] font-semibold sm:inline-flex"
          >
            <HexLogo size={20} alt="" />
            Hex
          </Link>
        </div>
        <Button
          variant="outline"
          className="rounded-[9px]"
          nativeButton={false}
          render={<Link href="/product/presentations" />}
        >
          Open existing PPTX
        </Button>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 pb-20 sm:px-8">
        <section className="mx-auto max-w-[820px] pt-4 text-center sm:pt-8">
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            AI presentations
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            What would you like to present?
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-muted-foreground">
            Describe your deck, pick a visual style, and Hex will generate an
            editable presentation you can refine in the editor.
          </p>

          <div className="relative mx-auto mt-10 max-w-[760px]">
            <div className="overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <textarea
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault();
                    void handleGenerate();
                  }
                }}
                placeholder="Pitch deck for a climate tech startup raising Series A…"
                rows={3}
                disabled={loading}
                className="min-h-[112px] w-full resize-none border-0 bg-transparent px-5 py-4 text-left text-[16px] leading-relaxed outline-none placeholder:text-muted-foreground/70"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {PRESENTON_SLIDE_COUNTS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      disabled={loading}
                      onClick={() => setNSlides(count)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[13px] transition-colors",
                        nSlides === count
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {count} slides
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  size="lg"
                  disabled={loading || !prompt.trim()}
                  onClick={() => void handleGenerate()}
                  className="h-11 rounded-[11px] px-5 text-[14px] font-semibold"
                >
                  <SparkleIcon className="mr-2 size-4" />
                  Generate
                </Button>
              </div>
            </div>
            {error ? (
              <p className="mt-3 text-left text-[14px] text-destructive">{error}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PRESENTON_IDEA_CHIPS.map((idea) => (
              <button
                key={idea}
                type="button"
                disabled={loading}
                onClick={() => {
                  setPrompt(idea);
                  setError(null);
                }}
                className="rounded-full border border-border bg-card/60 px-3.5 py-2 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {idea}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight">
                Choose a style
              </h2>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {selectedTemplate
                  ? `${selectedTemplate.label} · ${selectedTemplate.tagline}`
                  : "Pick a template for your generated deck"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESENTON_TEMPLATE_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                    category === item.id
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((item) => {
              const selected = template === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setTemplate(item.id)}
                  className={cn(
                    "group overflow-hidden rounded-[14px] border bg-card text-left transition-all",
                    selected
                      ? "border-foreground ring-2 ring-foreground/30"
                      : "border-border hover:border-foreground/25 hover:shadow-lg",
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    {item.preview ? (
                      <Image
                        src={item.preview}
                        alt={`${item.label} template preview`}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                    ) : (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br",
                          item.accent,
                        )}
                      />
                    )}
                    {selected ? (
                      <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[15px] font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {item.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
