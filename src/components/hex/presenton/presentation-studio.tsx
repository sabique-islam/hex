"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { HalftoneZone } from "@/components/hex/landing/halftone-zone";
import { SplitPrimaryButton } from "@/components/hex/landing/split-cta";
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
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
    <div className="hex-marketing-frame hex-presentation-studio relative">
      <HalftoneZone variant="marketing" />

      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-border bg-card">
              <SparkleIcon className="size-7 animate-pulse text-primary" />
            </div>
            <p className="text-xl font-semibold tracking-tight">
              Creating your presentation
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hex is generating slides with the{" "}
              <span className="font-medium text-foreground">
                {selectedTemplate?.label}
              </span>{" "}
              style. This usually takes a minute.
            </p>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 mx-auto w-full max-w-[72rem] px-5 pb-20 pt-8 sm:px-8">
        <section className="mx-auto max-w-[42rem] text-center">
          <span className="hex-hero-badge-mark inline-flex px-2 py-0.5 text-[10px]">
            AI
          </span>
          <h1 className="hex-marketing-title mt-4 max-w-none">
            What would you like to present?
          </h1>
          <p className="hex-marketing-lead mx-auto max-w-lg">
            Describe your deck, pick a visual style, and Hex will generate an
            editable presentation you can refine in the editor.
          </p>

          <div className="relative mx-auto mt-8 max-w-[40rem] text-left">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
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
                className="min-h-[6.5rem] w-full resize-none border-0 bg-transparent px-4 py-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/80"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PRESENTON_SLIDE_COUNTS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      disabled={loading}
                      onClick={() => setNSlides(count)}
                      className={cn(
                        "hex-pill",
                        nSlides === count
                          ? "hex-pill--active"
                          : "hex-pill--muted",
                      )}
                    >
                      {count} slides
                    </button>
                  ))}
                </div>
                <SplitPrimaryButton
                  label="Generate"
                  disabled={loading || !prompt.trim()}
                  onClick={() => void handleGenerate()}
                />
              </div>
            </div>
            {error ? (
              <p className="mt-2 text-left text-sm text-destructive">{error}</p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {PRESENTON_IDEA_CHIPS.map((idea) => (
              <button
                key={idea}
                type="button"
                disabled={loading}
                onClick={() => {
                  setPrompt(idea);
                  setError(null);
                }}
                className="hex-pill hex-pill--muted"
              >
                {idea}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-[56rem] sm:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Choose a style
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedTemplate
                  ? `${selectedTemplate.label} · ${selectedTemplate.tagline}`
                  : "Pick a template for your generated deck"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESENTON_TEMPLATE_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "hex-pill",
                    category === item.id
                      ? "hex-pill--active"
                      : "hex-pill--muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((item) => {
              const selected = template === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setTemplate(item.id)}
                  className={cn(
                    "hex-marketing-card overflow-hidden text-left",
                    selected && "border-primary ring-2 ring-primary/15",
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
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <div className="px-3.5 py-2.5">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
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
