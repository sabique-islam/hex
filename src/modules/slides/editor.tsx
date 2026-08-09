"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ISlideData } from "@univerjs/slides";
import {
  DEFAULT_SLIDE_DATA,
  HexSlidesShell,
  importPptxToSlides,
  loadFontsForSnapshot,
  type HexSlidesApi,
} from "@hex/slides";
import "@hex/slides/styles";
import { HexMarkLink } from "@/components/hex/hex-logo";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

export function SlidesEditor({ fileId }: { fileId: string }) {
  const apiRef = useRef<HexSlidesApi | null>(null);
  const [snapshot, setSnapshot] = useState<ISlideData | null>(null);
  const [name, setName] = useState("Untitled.pptx");
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
      try {
        if (record.bytes.byteLength > 0) {
          const buffer = record.bytes.slice(0).buffer;
          const imported = await importPptxToSlides(buffer, record.name);
          await loadFontsForSnapshot(imported);
          setSnapshot(imported);
        } else {
          setSnapshot({
            ...DEFAULT_SLIDE_DATA,
            id: `deck-${fileId}`,
            title: record.name.replace(/\.pptx$/i, "") || "Untitled presentation",
          });
        }
      } catch {
        setError("Could not open presentation");
      }
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

  const handleOpenPptx = useCallback(
    async (file: File) => {
      const buffer = await file.arrayBuffer();
      const imported = await importPptxToSlides(buffer, file.name);
      await loadFontsForSnapshot(imported);
      const nextName = file.name.toLowerCase().endsWith(".pptx")
        ? file.name
        : `${file.name}.pptx`;
      setName(nextName);
      setSnapshot({
        ...imported,
        id: `deck-${fileId}-${Date.now()}`,
      });
      await putFile({
        id: fileId,
        kind: "slides",
        name: nextName,
        bytes: buffer,
      });
    },
    [fileId],
  );

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm">{error}</div>
    );
  }
  if (!snapshot) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Loading presentation…
      </div>
    );
  }

  return (
    <div key={fileId} className="hex-slides h-dvh min-h-0">
      <HexSlidesShell
        snapshot={snapshot}
        fileName={name}
        onFileNameChange={setName}
        onDownload={() => void handleDownload()}
        onPersist={() => void persist()}
        onOpenPptx={(file) => handleOpenPptx(file)}
        brand={<HexMarkLink size={28} className="shrink-0" />}
        onReady={(api) => {
          apiRef.current = api;
        }}
      />
    </div>
  );
}
