"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IWorkbookData } from "@univerjs/core";
import {
  CasualSheets,
  emptyWorkbook,
  LOCALES,
  registerSheetsPlugins,
  type CasualSheetsAPI,
} from "@hex/sheets";
import "@hex/sheets/univer/facade";
import "@hex/sheets/styles";
import { useEditorAppearance } from "@/components/hex/editor-theme-sync";
import { HexEditorShell } from "@/components/hex/hex-shell";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

export function SheetsEditor({ fileId }: { fileId: string }) {
  const apiRef = useRef<CasualSheetsAPI | null>(null);
  const appearance = useEditorAppearance();
  const [initialData, setInitialData] = useState<IWorkbookData | null>(null);
  const [name, setName] = useState("Untitled.xlsx");
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
          const { xlsxToWorkbookData } = await import("@casualoffice/sheets/xlsx");
          const buffer = record.bytes.slice(0);
          setInitialData(await xlsxToWorkbookData(buffer));
        } else {
          setInitialData(emptyWorkbook());
        }
      } catch {
        setError("Could not open spreadsheet");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  const persist = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;
    const blob = await api.export();
    const bytes = await blob.arrayBuffer();
    await putFile({ id: fileId, kind: "sheets", name, bytes });
  }, [fileId, name]);

  const handleDownload = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;
    const blob = await api.export();
    const bytes = await blob.arrayBuffer();
    await putFile({ id: fileId, kind: "sheets", name, bytes });
    downloadBlob(new Blob([bytes], { type: mimeForKind("sheets") }), name);
  }, [fileId, name]);

  if (error) {
    return <div className="flex h-full items-center justify-center text-sm">{error}</div>;
  }
  if (!initialData) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Loading spreadsheet…
      </div>
    );
  }

  return (
    <HexEditorShell
      kind="sheets"
      name={name}
      onNameChange={setName}
      onDownload={() => void handleDownload()}
      onPersist={() => void persist()}
    >
      <CasualSheets
        key={fileId}
        className="hex-sheets h-full"
        initialData={initialData}
        locales={LOCALES}
        lazyPlugins={false}
        chrome="full"
        appearance={appearance}
        onBeforeCreateUnit={registerSheetsPlugins}
        style={{ width: "100%", height: "100%" }}
        onReady={(api) => {
          apiRef.current = api;
        }}
        onChange={() => void persist()}
        onSave={() => void persist()}
      />
    </HexEditorShell>
  );
}
