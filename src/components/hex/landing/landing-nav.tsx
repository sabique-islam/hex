import Link from "next/link";
import { HexLogo } from "@/components/hex/hex-logo";
import { PRODUCT_ITEMS } from "@/lib/products";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Why Hex", href: "/why-hex" },
  { label: "About", href: "/about" },
  { label: "Templates", href: "/templates" },
] as const;

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={cn("size-3.5 text-[var(--landing-nav-subtle)]", className)}
      aria-hidden
    >
      <path
        d="M3 4.5 6 7.5 9 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductMenu() {
  return (
    <div className="hex-product-menu group relative">
      <Link
        href="/product"
        className="hex-landing-nav-link inline-flex items-center gap-1 text-[17px] font-medium"
      >
        Product
        <ChevronDown className="transition-transform group-hover:rotate-180" />
      </Link>

      <div className="hex-product-menu-panel pointer-events-none absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="min-w-[280px] rounded-[12px] border border-[var(--landing-border)] bg-[var(--landing-surface)] py-2">
          {PRODUCT_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="block px-4 py-3 transition-colors hover:bg-[var(--landing-surface-hover)]"
            >
              <span className="hex-landing-nav-dropdown-title block text-[15px] font-medium">
                {item.label}
              </span>
              <span className="hex-landing-nav-dropdown-desc mt-0.5 block text-[13px] leading-snug">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingNav({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <header className="mx-auto flex w-full max-w-[1430px] items-center justify-between px-6 pt-10 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="hex-landing-nav-brand inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-tight"
      >
        <HexLogo size={22} alt="" />
        Hex
      </Link>

      <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
        <ProductMenu />
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="hex-landing-nav-link text-[17px] font-medium"
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={onGetStarted}
        className="hex-landing-btn-outline inline-flex h-10 min-w-[120px] items-center justify-center rounded-[9px] px-4 text-[14px] font-medium transition-colors sm:h-[52px] sm:min-w-[150px] sm:px-5 sm:text-[15px]"
      >
        Get started
      </button>
    </header>
  );
}
