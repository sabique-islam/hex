"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HexSlides, type HexSlidesApi } from "@hex/slides";
import "@hex/slides/styles";
import { HexEditorShell } from "@/components/hex/hex-shell";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

export function SlidesEditor({ fileId }: { fileId: string }) {
  const apiRef = useRef<HexSlidesApi | null>(null);
  const [pptxBytes, setPptxBytes] = useState<ArrayBuffer | null | undefined>(undefined);
  const [name, setName] = useState("Untitled.pptx");
  const [error, setError] = useState<string | null>(null);
  const [mountKey, setMountKey] = useState(0);

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
      setPptxBytes(record.bytes.byteLength > 0 ? record.bytes.slice(0) : null);
      setMountKey((k) => k + 1);
    })();
    return () => {
      cancelled = true;
      apiRef.current = null;
    };
  }, [fileId]);

  const persist = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;
    const blob = await api.exportPptx();
    const bytes = await blob.arrayBuffer();
    await putFile({ id: fileId, kind: "slides", name, bytes });
  }, [fileId, name]);

  const handleDownload = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;
    const blob = await api.exportPptx();
    const bytes = await blob.arrayBuffer();
    await putFile({ id: fileId, kind: "slides", name, bytes });
    downloadBlob(new Blob([bytes], { type: mimeForKind("slides") }), name);
  }, [fileId, name]);

  if (error) {
    return <div className="flex h-full items-center justify-center text-sm">{error}</div>;
  }
  if (pptxBytes === undefined) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Loading presentation…
      </div>
    );
  }

  return (
    <HexEditorShell
      kind="slides"
      name={name}
      onNameChange={setName}
      onDownload={() => void handleDownload()}
      onPersist={() => void persist()}
    >
      <HexSlides
        key={mountKey}
        className="hex-slides h-full"
        pptxBytes={pptxBytes}
        pptxFileName={name}
        onReady={(api) => {
          apiRef.current = api;
        }}
      />
    </HexEditorShell>
  );
}
