import Link from "next/link";
import { HexLogo } from "@/components/hex/hex-logo";

export function LandingFooter() {
  return (
    <footer className="hex-landing-footer">
      <div className="hex-landing-footer-inner">
        <Link href="/" className="hex-landing-footer-logo">
          <HexLogo size={24} alt="" tone="dark" />
          <span>Hex</span>
        </Link>
        <p className="hex-landing-footer-tagline">
          Make every document editable in your browser, on your device.
        </p>
      </div>
    </footer>
  );
}
