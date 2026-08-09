"use client";

import { HeroIllustration } from "./hero-illustration";

function HeadlineUnderline() {
  return (
    <svg
      className="hex-headline-underline"
      viewBox="0 0 240 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 8 C 40 10, 80 6, 120 8 S 200 10, 238 7"
        stroke="#f5f5f5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LandingHero({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <section className="mx-auto grid w-full max-w-[1430px] gap-10 px-6 pt-14 sm:px-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-10 lg:pt-16">
      <div className="max-w-[550px]">
        <h1 className="relative inline-block max-w-[560px] text-[clamp(2.75rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--landing-fg)]">
          <span className="relative inline-block">
            Make every document
            <HeadlineUnderline />
          </span>
          <br />
          editable
        </h1>

        <p className="mt-8 max-w-[540px] text-[21px] leading-[1.6] text-[var(--landing-muted)]">
          Generate, edit, redesign and collaborate on any document | directly in
          your browser. Turn PDFs, presentations, scans and more into fully
          editable documents.
        </p>

        <div className="mt-10">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex h-[52px] min-w-[180px] items-center justify-center rounded-[9px] border border-[var(--landing-border)] bg-[var(--landing-accent)] px-8 text-[15px] font-semibold text-[var(--landing-accent-fg)] transition-opacity hover:opacity-90"
          >
            Get started
          </button>
        </div>

        <div className="mt-10 flex max-w-[470px] items-start gap-8">
          <div>
            <p className="text-[42px] font-semibold leading-none tracking-tight">
              Any file
            </p>
            <p className="mt-2 text-[15px] text-[var(--landing-muted)]">
              PDF | PPTX | DOCX | images &amp; scans
            </p>
          </div>
          <span className="mt-2 h-12 w-px bg-[var(--landing-border)]" />
          <div>
            <p className="text-[42px] font-semibold leading-none tracking-tight">
              100%
            </p>
            <p className="mt-2 text-[15px] text-[var(--landing-muted)]">
              Fully editable
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-[470px] border-t border-[var(--landing-border)] pt-5">
          <p className="text-[15px] font-medium text-[var(--landing-muted)]">
            Generate | Edit | Redesign | Collaborate
          </p>
          <p className="mt-3 text-[14px] text-[var(--landing-muted)]">
            PDF | PPTX | DOCX | Scans | fully editable documents
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[620px] lg:mx-0 lg:justify-self-end">
        <HeroIllustration />
      </div>
    </section>
  );
}
