import Link from "next/link";
import { cn } from "@/lib/utils";

function CtaArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-[15px]", className)}
      aria-hidden
    >
      <path
        d="M3.5 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const splitBase =
  "inline-flex h-10 items-stretch overflow-hidden rounded-[7px] bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,87,255,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] transition-[box-shadow,transform] duration-150 ease-out hover:bg-[var(--primary-hover)] hover:shadow-[0_2px_8px_rgba(0,87,255,0.28)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const splitLabel =
  "inline-flex flex-1 items-center justify-center px-4 text-[13px] font-medium tracking-[-0.01em]";

const splitArrowCell =
  "inline-flex w-10 shrink-0 items-center justify-center border-l border-white/15 bg-[#0047d4]";

export function SplitPrimaryButton({
  label,
  onClick,
  type = "button",
  disabled,
  className,
}: {
  label: string;
  onClick?: () => void;
  type?: "button";
  disabled?: boolean;
  className?: string;
}) {
  const fullWidth = className?.includes("w-full");
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(splitBase, fullWidth && "flex w-full", className)}
    >
      <span className={splitLabel}>{label}</span>
      <span className={splitArrowCell} aria-hidden>
        <CtaArrow />
      </span>
    </button>
  );
}

export function SplitPrimaryLink({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(splitBase, className)}>
      <span className={splitLabel}>{label}</span>
      <span className={splitArrowCell} aria-hidden>
        <CtaArrow />
      </span>
    </Link>
  );
}

const secondaryBase =
  "inline-flex h-10 items-center justify-center rounded-[7px] bg-[#f4f4f5] px-4 text-[13px] font-medium tracking-[-0.01em] text-[#18181b] transition-colors duration-150 hover:bg-[#ececee] active:bg-[#e4e4e7]";

export function OutlineButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={cn(secondaryBase, className)}>
      {label}
    </button>
  );
}

export function OutlineLink({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(secondaryBase, className)}>
      {label}
    </Link>
  );
}
