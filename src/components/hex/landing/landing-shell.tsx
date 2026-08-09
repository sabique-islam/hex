"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LandingNav } from "@/components/hex/landing/landing-nav";
import {
  ACCEPT_OPEN,
  defaultFilename,
  kindFromFilename,
  type EditorKind,
} from "@/lib/kinds";
import { newFileId, putFile } from "@/lib/storage";

const LandingActionsContext = createContext<{
  getStarted: () => void;
  createNew: (kind?: EditorKind) => Promise<void>;
} | null>(null);

export function useLandingActions() {
  const ctx = useContext(LandingActionsContext);
  if (!ctx) {
    throw new Error("useLandingActions must be used within LandingShell");
  }
  return ctx;
}

async function blankBytes(kind: EditorKind): Promise<ArrayBuffer> {
  if (kind === "pdf") {
    const { createBlankPdfBytes } = await import("@hex/pdf/blank");
    const bytes = await createBlankPdfBytes();
    return bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
  }
  return new ArrayBuffer(0);
}

export function LandingShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditor = useCallback(
    (kind: EditorKind, id: string) => {
      router.push(`/editor/${kind}?id=${encodeURIComponent(id)}`);
    },
    [router],
  );

  const createNew = useCallback(
    async (kind: EditorKind = "docs") => {
      const id = newFileId();
      const bytes = await blankBytes(kind);
      await putFile({
        id,
        kind,
        name: defaultFilename(kind),
        bytes,
      });
      openEditor(kind, id);
    },
    [openEditor],
  );

  const onPickFile = useCallback(
    async (file: File) => {
      const kind = kindFromFilename(file.name);
      if (!kind) {
        alert("Unsupported file type. Use DOCX, XLSX/CSV/ODS, PPTX, or PDF.");
        return;
      }
      const id = newFileId();
      const bytes = await file.arrayBuffer();
      await putFile({ id, kind, name: file.name, bytes });
      openEditor(kind, id);
    },
    [openEditor],
  );

  const getStarted = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <LandingActionsContext.Provider value={{ getStarted, createNew }}>
      <div className="hex-landing min-h-[100dvh] pb-24">
        <LandingNav onGetStarted={getStarted} />
        {children}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_OPEN}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onPickFile(file);
          }}
        />
      </div>
    </LandingActionsContext.Provider>
  );
}
