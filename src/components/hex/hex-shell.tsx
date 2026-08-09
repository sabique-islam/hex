import type { ReactNode } from "react";
import type { EditorKind } from "@/lib/kinds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
    <header className="relative">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HexMarkLink />
        {showGitHub ? <HexGitHubLink /> : null}
      </div>
      <Separator />
    </header>
  );
}

export function HexEditorShell({
  kind,
  name,
  onNameChange,
  onDownload,
  onPersist,
  children,
}: {
  kind: EditorKind;
  name: string;
  onNameChange: (value: string) => void;
  onDownload: () => void;
  onPersist?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="hex-editor flex h-dvh min-h-0 flex-col bg-background">
      <header className="hex-editor-bar flex h-12 shrink-0 items-center gap-3 px-3 sm:px-4">
        <HexMarkLink size={20} className="shrink-0" />
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {KIND_LABEL[kind]}
        </Badge>
        <Input
          aria-label="File name"
          className="h-8 min-w-0 flex-1 border-transparent bg-transparent px-2 shadow-none focus-visible:ring-0"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => onPersist?.()}
        />
        <Button size="sm" onClick={onDownload}>
          Download
        </Button>
      </header>
      <Separator />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
