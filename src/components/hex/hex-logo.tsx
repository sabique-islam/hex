import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetEditorAppearance } from "@/lib/editor-theme";

const GITHUB_URL = "https://github.com/sabique-islam/hex";

const LOGO_WIDTH = 650;
const LOGO_HEIGHT = 558;
const LOGO_ASPECT = LOGO_HEIGHT / LOGO_WIDTH;

export function HexLogo({
  size = 32,
  className,
  alt = "Hex",
  tone = "brand",
}: {
  size?: number;
  className?: string;
  alt?: string;
  tone?: "brand" | "dark" | "light";
}) {
  const width = size;
  const height = Math.max(1, Math.round(size * LOGO_ASPECT));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hex-logo-transparent.png"
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      className={cn(
        "hex-logo block shrink-0 bg-transparent object-contain",
        tone === "dark" && "brightness-0",
        tone === "light" && "brightness-0 invert",
        className,
      )}
    />
  );
}

export function HexMarkLink({
  size = 24,
  className,
  tone = "dark",
}: {
  size?: number;
  className?: string;
  tone?: "brand" | "dark" | "light";
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto gap-2 px-0 font-heading text-lg font-semibold tracking-tight hover:bg-transparent",
        tone === "light" && "text-white hover:text-white",
        className,
      )}
      nativeButton={false}
      render={
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          onClick={() => resetEditorAppearance()}
        />
      }
    >
      <HexLogo size={size} alt="" tone={tone} />
      <span>Hex</span>
    </Button>
  );
}

export function HexGitHubLink({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      nativeButton={false}
      render={
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
    >
      <GitHubIcon className="size-4" />
      GitHub
    </Button>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

export { GITHUB_URL };
