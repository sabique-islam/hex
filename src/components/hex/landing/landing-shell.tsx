"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { GetStartedDialog } from "@/components/hex/landing/get-started-dialog";
import { LandingNav } from "@/components/hex/landing/landing-nav";
import { cn } from "@/lib/utils";
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
  generateSlides: () => void;
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

export function LandingShell({
  children,
  viewport = false,
}: {
  children: ReactNode;
  viewport?: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const openEditor = useCallback(
    (kind: EditorKind, id: string) => {
      router.push(`/editor/${kind}?id=${encodeURIComponent(id)}`);
    },
    [router],
  );

  const createNew = useCallback(
    async (kind: EditorKind = "docs") => {
      setGetStartedOpen(false);
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
      setGetStartedOpen(false);
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
    setGetStartedOpen(true);
  }, []);

  const openFilePicker = useCallback(() => {
    setGetStartedOpen(false);
    fileInputRef.current?.click();
  }, []);

  const generateSlides = useCallback(() => {
    setGetStartedOpen(false);
    router.push("/create/presentation");
  }, [router]);

  return (
    <LandingActionsContext.Provider
      value={{ getStarted, createNew, generateSlides }}
    >
      <div
        className={cn("hex-landing", viewport && "hex-landing--viewport")}
      >
        <LandingNav onGetStarted={getStarted} />
        {children}
        <GetStartedDialog
          open={getStartedOpen}
          onClose={() => setGetStartedOpen(false)}
          onOpenFile={openFilePicker}
          onCreateNew={(kind) => void createNew(kind)}
          onGenerateSlides={generateSlides}
        />
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
