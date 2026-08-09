import type { ReactNode } from "react";

export function MarketingPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[1430px] px-6 pb-20 pt-14 sm:px-8 lg:px-10 lg:pt-16">
      <div className="max-w-2xl">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-[var(--landing-fg)]">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 text-[18px] leading-[1.6] text-[var(--landing-muted)]">
            {lead}
          </p>
        ) : null}
        <div className="mt-10 space-y-4 text-[16px] leading-[1.7] text-[var(--landing-muted)]">
          {children}
        </div>
      </div>
    </main>
  );
}
