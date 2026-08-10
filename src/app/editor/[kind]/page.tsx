"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OutlineLink } from "@/components/hex/landing/split-cta";
import { isEditorKind } from "@/lib/kinds";

const DocsEditor = dynamic(
  () => import("@/modules/docs/editor").then((m) => m.DocsEditor),
  { ssr: false, loading: () => <EditorLoading label="document" /> },
);
const SheetsEditor = dynamic(
  () => import("@/modules/sheets/editor").then((m) => m.SheetsEditor),
  { ssr: false, loading: () => <EditorLoading label="spreadsheet" /> },
);
const SlidesEditor = dynamic(
  () => import("@/modules/slides/editor").then((m) => m.SlidesEditor),
  { ssr: false, loading: () => <EditorLoading label="presentation" /> },
);
const PdfEditor = dynamic(
  () => import("@/modules/pdf/editor").then((m) => m.PdfEditor),
  { ssr: false, loading: () => <EditorLoading label="PDF" /> },
);

function EditorLoading({ label }: { label: string }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
      <div className="size-5 animate-pulse rounded-full bg-primary/20" />
      Loading {label} editor…
    </div>
  );
}

function EditorError({ message }: { message: string }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <OutlineLink label="Back to Hex" href="/" />
    </div>
  );
}

function EditorBody() {
  const params = useParams<{ kind: string }>();
  const search = useSearchParams();
  const kind = params.kind;
  const id = search.get("id");

  if (!id) {
    return <EditorError message="Missing file id." />;
  }

  if (!isEditorKind(kind)) {
    return <EditorError message="Unknown editor kind." />;
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-background">
      {kind === "docs" && <DocsEditor fileId={id} />}
      {kind === "sheets" && <SheetsEditor fileId={id} />}
      {kind === "slides" && <SlidesEditor fileId={id} />}
      {kind === "pdf" && <PdfEditor fileId={id} />}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading label="editor" />}>
      <EditorBody />
    </Suspense>
  );
}
