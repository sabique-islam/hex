import Link from "next/link";
import { HexLogo } from "@/components/hex/hex-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      className={cn("size-3.5 opacity-70", className)}
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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1 text-[17px] font-medium text-muted-foreground hover:text-foreground"
      >
        Product
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[280px] rounded-[12px] p-2">
        {PRODUCT_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.slug}
            className="h-auto rounded-[9px] px-3 py-3"
            render={<Link href={item.href} />}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-medium text-foreground">
                {item.label}
              </span>
              <span className="text-[13px] leading-snug text-muted-foreground">
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
    <header className="mx-auto flex w-full max-w-[1430px] items-center justify-between px-6 pt-10 sm:px-8 lg:px-10">
      <Button
        variant="ghost"
        className="h-auto gap-2.5 px-0 text-[17px] font-semibold tracking-tight hover:bg-transparent"
        nativeButton={false}
        render={
          <Link href="/" className="inline-flex items-center gap-2.5" />
        }
      >
        <HexLogo size={22} alt="" />
        Hex
      </Button>

      <nav className="hidden items-center gap-2 lg:flex xl:gap-3">
        <ProductMenu />
        {NAV.map(({ label, href }) => (
          <Button
            key={href}
            variant="ghost"
            className="h-auto px-3 text-[17px] font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
            nativeButton={false}
            render={<Link href={href} />}
          >
            {label}
          </Button>
        ))}
      </nav>

      <Button
        type="button"
        variant="outline"
        onClick={onGetStarted}
        className="h-10 min-w-[120px] rounded-[9px] text-[14px] sm:h-[52px] sm:min-w-[150px] sm:px-5 sm:text-[15px]"
      >
        Get started
      </Button>
    </header>
  );
}
