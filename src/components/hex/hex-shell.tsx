import { useRef, type ReactNode } from "react";
import type { EditorKind } from "@/lib/kinds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HexGitHubLink, HexMarkLink } from "./hex-logo";

const KIND_LABEL: Record<EditorKind, string> = {
  docs: "Document",
  sheets: "Spreadsheet",
  slides: "Presentation",
  pdf: "PDF",
};

export function HexSiteHeader({
  showGitHub = true,
}: {
  showGitHub?: boolean;
}) {
  return (
    <header className="hex-landing-nav">
      <div className="hex-landing-nav-inner !flex !max-w-5xl">
        <HexMarkLink />
        {showGitHub ? <HexGitHubLink className="ml-auto" /> : null}
      </div>
    </header>
  );
}

export function HexEditorShell({
  kind,
  name,
  onNameChange,
  onDownload,
  onPersist,
  headerActions,
  children,
}: {
  kind: EditorKind;
  name: string;
  onNameChange: (value: string) => void;
  onDownload: () => void;
  onPersist?: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  const filenameInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="hex-editor flex h-dvh min-h-0 flex-col bg-background">
      <header className="hex-editor-bar flex h-12 shrink-0 items-center gap-3 px-3 sm:px-4">
        <HexMarkLink size={20} tone="light" className="shrink-0" />
        <Badge
          variant="secondary"
          className="hidden border-white/10 bg-white/10 text-white sm:inline-flex"
        >
          {KIND_LABEL[kind]}
        </Badge>
        <Input
          ref={filenameInputRef}
          aria-label="File name"
          className="h-8 min-w-0 flex-1 border-transparent bg-transparent px-2 text-white shadow-none placeholder:text-white/40 focus-visible:ring-0"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => onPersist?.()}
        />
        {headerActions}
        <Button
          size="sm"
          className="bg-white text-black hover:bg-white/90"
          onClick={onDownload}
        >
          Download
        </Button>
      </header>
      <div
        className="min-h-0 flex-1 overflow-hidden"
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("input, textarea, button, a, [role='dialog']")) return;
          filenameInputRef.current?.blur();
        }}
      >
        {children}
      </div>
    </div>
  );
}
