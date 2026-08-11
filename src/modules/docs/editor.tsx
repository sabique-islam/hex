"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DocxEditor,
  createEmptyDocument,
  type DocxEditorRef,
  type Document,
} from "@hex/docs";
import "@hex/docs/styles.css";
import { HexEditorShell } from "@/components/hex/hex-shell";
import { useEditorAppearance } from "@/components/hex/editor-theme-sync";
import { applyEditorAppearance } from "@/lib/editor-theme";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

export function DocsEditor({ fileId }: { fileId: string }) {
  const ref = useRef<DocxEditorRef>(null);
  const appearance = useEditorAppearance();
  const [document, setDocument] = useState<Document | null>(null);
  const [documentBuffer, setDocumentBuffer] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("Untitled.docx");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const record = await getFile(fileId);
      if (cancelled) return;
      if (!record) {
        setError("File not found");
        return;
      }
      setName(record.name);
      if (record.bytes.byteLength > 0) {
        setDocumentBuffer(record.bytes.slice(0));
        setDocument(null);
      } else {
        setDocument(createEmptyDocument());
        setDocumentBuffer(null);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  useEffect(() => {
    applyEditorAppearance(appearance);
  }, [appearance]);

  const persist = useCallback(async () => {
    const buffer = await ref.current?.save();
    if (!buffer) return;
    await putFile({ id: fileId, kind: "docs", name, bytes: buffer });
  }, [fileId, name]);

  const handleDownload = useCallback(async () => {
    const buffer = await ref.current?.save();
    if (!buffer) return;
    await putFile({ id: fileId, kind: "docs", name, bytes: buffer });
    downloadBlob(new Blob([buffer], { type: mimeForKind("docs") }), name);
  }, [fileId, name]);

  if (error) {
    return <div className="flex h-full items-center justify-center text-sm">{error}</div>;
  }
  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Loading document…
      </div>
    );
  }

  return (
    <HexEditorShell
      kind="docs"
      name={name}
      onNameChange={setName}
      onDownload={() => void handleDownload()}
      onPersist={() => void persist()}
    >
      <div className="h-full" data-theme={appearance}>
        <DocxEditor
          ref={ref}
          className="hex-docs h-full"
          document={documentBuffer ? undefined : document}
          documentBuffer={documentBuffer ?? undefined}
          chrome="embedded"
          showToolbar
          showRuler
          showZoomControl
          onSave={() => void persist()}
        />
      </div>
    </HexEditorShell>
  );
}
