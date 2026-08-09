import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

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
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 text-[18px] leading-[1.6] text-muted-foreground">
            {lead}
          </p>
        ) : null}
        <div className="mt-10 space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
          {children}
        </div>
      </div>
    </main>
  );
}

export function MarketingSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Separator className="my-10" />
      {children}
    </div>
  );
}
