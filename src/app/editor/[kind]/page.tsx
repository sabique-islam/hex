"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
    <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
      Loading {label} editor…
    </div>
  );
}

function EditorBody() {
  const params = useParams<{ kind: string }>();
  const search = useSearchParams();
  const kind = params.kind;
  const id = search.get("id");

  if (!id) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 text-sm">
        <p>Missing file id.</p>
        <a href="/" className="underline">
          Back to Hex
        </a>
      </div>
    );
  }

  if (!isEditorKind(kind)) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 text-sm">
        <p>Unknown editor kind.</p>
        <a href="/" className="underline">
          Back to Hex
        </a>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full overflow-hidden">
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
