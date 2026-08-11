"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CasualPdf, type CasualPdfApi } from "@hex/pdf";
import { useEditorAppearance } from "@/components/hex/editor-theme-sync";
import { HexEditorShell } from "@/components/hex/hex-shell";
import { Button } from "@/components/ui/button";
import { applyEditorAppearance } from "@/lib/editor-theme";
import { mimeForKind } from "@/lib/kinds";
import { downloadBlob, getFile, putFile } from "@/lib/storage";

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

export function PdfEditor({ fileId }: { fileId: string }) {
  const apiRef = useRef<CasualPdfApi | null>(null);
  const appearance = useEditorAppearance();
  const [invertPages, setInvertPages] = useState(false);
  const latestBytesRef = useRef<ArrayBuffer | null>(null);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [name, setName] = useState("Untitled.pdf");
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

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
      latestBytesRef.current = record.bytes.slice(0);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(
        new Blob([record.bytes], { type: mimeForKind("pdf") }),
      );
      objectUrlRef.current = url;
      setSrc(url);
    })();
    return () => {
      cancelled = true;
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [fileId]);

  useEffect(() => {
    applyEditorAppearance(appearance);
  }, [appearance]);

  const persistBytes = useCallback(
    async (bytes: ArrayBuffer) => {
      latestBytesRef.current = bytes;
      await putFile({ id: fileId, kind: "pdf", name, bytes });
    },
    [fileId, name],
  );

  const persistFromApi = useCallback(async () => {
    try {
      const bytes = await apiRef.current?.getBytes();
      if (!bytes) return;
      await persistBytes(toArrayBuffer(bytes));
    } catch {
      // Text-edit commits reload the document in-session via openDocumentBuffer,
      // so exportCap still targets the previous document id until the tool exits
      // and onDocumentReplaced delivers the final bytes.
    }
  }, [persistBytes]);

  const schedulePersistFromApi = useCallback(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      void persistFromApi();
    }, 400);
  }, [persistFromApi]);

  const handleDownload = useCallback(async () => {
    try {
      const bytes = await apiRef.current?.getBytes();
      if (bytes) {
        const slice = toArrayBuffer(bytes);
        await persistBytes(slice);
        downloadBlob(new Blob([slice], { type: mimeForKind("pdf") }), name);
        return;
      }
    } catch {
      /* fall back to last known bytes */
    }

    const cached = latestBytesRef.current;
    if (cached) {
      downloadBlob(new Blob([cached], { type: mimeForKind("pdf") }), name);
      return;
    }

    apiRef.current?.download();
  }, [name, persistBytes]);

  const apiRefProp = useMemo(
    () => ({
      get current() {
        return apiRef.current;
      },
      set current(v: CasualPdfApi | null) {
        apiRef.current = v;
      },
    }),
    [],
  );

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm">
        {error}
      </div>
    );
  }
  if (!src) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Loading PDF…
      </div>
    );
  }

  return (
    <HexEditorShell
      kind="pdf"
      name={name}
      onNameChange={setName}
      onDownload={() => void handleDownload()}
      onPersist={() => void persistFromApi()}
      headerActions={
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="hidden text-white hover:bg-white/10 sm:inline-flex"
          aria-pressed={invertPages}
          aria-label={invertPages ? "Disable page color inversion" : "Invert page colors"}
          title={invertPages ? "Restore original page colors" : "Invert page colors for dark reading"}
          onClick={() => setInvertPages((v) => !v)}
        >
          {invertPages ? "Original colors" : "Invert colors"}
        </Button>
      }
    >
      <CasualPdf
        src={src}
        mode="edit"
        appearance="dark"
        invertPages={invertPages}
        apiRef={apiRefProp}
        className="hex-pdf h-full"
        style={{ width: "100%", height: "100%" }}
        onEdited={schedulePersistFromApi}
        onDocumentReplaced={(bytes) => {
          const slice = toArrayBuffer(bytes);
          void persistBytes(slice).then(() => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            const url = URL.createObjectURL(
              new Blob([slice], { type: mimeForKind("pdf") }),
            );
            objectUrlRef.current = url;
            setSrc(url);
          });
        }}
      />
    </HexEditorShell>
  );
}
