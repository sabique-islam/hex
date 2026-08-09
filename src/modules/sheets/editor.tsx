"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CasualSheets,
  emptyWorkbook,
  type CasualSheetsAPI,
} from "@hex/sheets";
import "@hex/sheets/styles";
import { HexEditorShell } from "@/components/hex/hex-shell";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

export function SheetsEditor({ fileId }: { fileId: string }) {
  const apiRef = useRef<CasualSheetsAPI | null>(null);
  const pendingImport = useRef<ArrayBuffer | null>(null);
  const [initialData, setInitialData] = useState<ReturnType<typeof emptyWorkbook> | null>(null);
  const [name, setName] = useState("Untitled.xlsx");
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
      pendingImport.current =
        record.bytes.byteLength > 0 ? record.bytes.slice(0) : null;
      setInitialData(emptyWorkbook());
      setMountKey((k) => k + 1);
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
        key={mountKey}
        className="hex-sheets h-full"
        initialData={initialData}
        chrome="full"
        appearance="light"
        style={{ width: "100%", height: "100%" }}
        onReady={(api) => {
          apiRef.current = api;
          const bytes = pendingImport.current;
          pendingImport.current = null;
          if (bytes) void api.import(bytes);
        }}
        onChange={() => void persist()}
        onSave={() => void persist()}
      />
    </HexEditorShell>
  );
}
