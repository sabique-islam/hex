import Link from "next/link";
import { HexLogo, GITHUB_URL } from "@/components/hex/hex-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PRODUCT_ITEMS } from "@/lib/products";
import { SplitPrimaryButton } from "@/components/hex/landing/split-cta";

const NAV = [
  { label: "Why Hex", href: "/why-hex" },
  { label: "About", href: "/about" },
  { label: "Templates", href: "/templates" },
] as const;

function ChevronDown() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="size-3 opacity-60" aria-hidden>
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function ProductMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hex-landing-nav-link">
        Product
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[17.5rem] rounded-lg p-1.5">
        {PRODUCT_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.slug}
            className="h-auto rounded-md px-3 py-2.5"
            render={<Link href={item.href} />}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
              <span className="text-xs leading-snug text-muted-foreground">
                {item.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LandingNav({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <header className="hex-landing-nav">
      <div className="hex-landing-nav-inner">
        <Link href="/" className="hex-landing-nav-brand">
          <HexLogo size={20} alt="" tone="dark" />
          Hex
        </Link>

        <nav className="hex-landing-nav-links">
          <ProductMenu />
          {NAV.map(({ label, href }) => (
            <Link key={href} href={href} className="hex-landing-nav-link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hex-landing-nav-actions">
          <Button
            variant="ctaSecondary"
            size="cta"
            className="hidden rounded-[7px] text-[13px] sm:inline-flex"
            nativeButton={false}
            render={
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <GitHubIcon className="size-3.5" />
            GitHub
          </Button>
          <SplitPrimaryButton label="Get started" onClick={onGetStarted} />
        </div>
      </div>
    </header>
  );
}
