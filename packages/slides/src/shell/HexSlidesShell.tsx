"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Univer } from "@univerjs/core";
import {
  IUniverInstanceService,
  UniverInstanceType,
} from "@univerjs/core";

import type { ISlideData, SlideDataModel } from "@univerjs/slides";

import { HexSlides, type HexSlidesApi } from "../HexSlides";
import { dispatchSlideCommand } from "../univer/commands";
import "../i18n";
import { ElementContextMenu } from "./ElementContextMenu";
import { FormatPaneProvider } from "./FormatPane";
import { NotesPanel } from "./NotesPanel";
import { SlideRailProvider } from "./SlideRail";
import { StatusBar } from "./StatusBar";
import { TitleBar } from "./TitleBar";
import { Toolbar } from "./Toolbar";
import { useSlideKeyboardShortcuts } from "./useSlideKeyboardShortcuts";
import {
  applySlideZoom,
  scheduleScaleAwareRecenter,
  scheduleScrollSlideToCenter,
} from "./slideViewport";

export type SlidesAppearance = "light" | "dark";

function getCurrentSnapshot(fallback: ISlideData): ISlideData {
  const w = window as unknown as { univer?: Univer };
  const univer = w.univer;
  if (!univer) return fallback;
  const instances = univer.__getInjector().get(IUniverInstanceService);
  const model = instances.getCurrentUnitOfType<SlideDataModel>(
    UniverInstanceType.UNIVER_SLIDE,
  );
  if (!model) return fallback;
  return model.getSnapshot() ?? fallback;
}

export interface HexSlidesShellProps {
  snapshot: ISlideData;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onDownload: () => void | Promise<void>;
  onPersist: () => void | Promise<void>;
  onOpenPptx?: (file: File) => void | Promise<void>;
  onReady?: (api: HexSlidesApi) => void;
  brand?: ReactNode;
  saving?: boolean;
  appearance?: SlidesAppearance;
}

function HexSlidesShellInner({
  snapshot,
  fileName,
  onFileNameChange,
  onDownload,
  onPersist,
  onOpenPptx,
  onReady,
  brand,
  saving: savingProp = false,
  appearance = "light",
}: HexSlidesShellProps) {
  const apiRef = useRef<HexSlidesApi | null>(null);
  const openInputRef = useRef<HTMLInputElement>(null);
  const persistTimerRef = useRef<number | null>(null);
  const zoomStateRef = useRef<{ priorZoom: number | null }>({ priorZoom: null });
  const [opening, setOpening] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [notesVisible, setNotesVisible] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const slideCount = useMemo(
    () => snapshot.body?.pageOrder?.length ?? 0,
    [snapshot.body?.pageOrder?.length, snapshot.id],
  );

  const markDirty = useCallback(() => setDirty(true), []);

  const schedulePersist = useCallback(() => {
    markDirty();
    if (persistTimerRef.current != null) {
      window.clearTimeout(persistTimerRef.current);
    }
    persistTimerRef.current = window.setTimeout(() => {
      void onPersist();
    }, 1500);
  }, [markDirty, onPersist]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onPersist();
      setDirty(false);
      setStatus("Saved");
    } catch {
      setError("Could not save presentation");
    } finally {
      setSaving(false);
    }
  }, [onPersist]);

  const handleFitToWindow = useCallback(() => {
    setZoom(100);
    applySlideZoom(100);
    scheduleScrollSlideToCenter();
  }, []);

  const handleInsertShape = useCallback(() => {
    void dispatchSlideCommand("slide.command.insert-float-shape.rectangle");
  }, []);

  const handleToggleSlidePanel = useCallback(() => {
    const node = document.querySelector(
      '[data-u-comp="left-sidebar"]',
    ) as HTMLElement | null;
    if (node) {
      node.style.display = node.style.display === "none" ? "" : "none";
    }
  }, []);

  const handleMakeCopy = useCallback(() => {
    setStatus("Make a copy is not available in Hex yet");
  }, []);

  const handleOpenPptx = useCallback(() => {
    openInputRef.current?.click();
  }, []);

  const handleOpenFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !onOpenPptx) return;
      setOpening(true);
      setError(null);
      try {
        await onOpenPptx(file);
        setDirty(false);
        setStatus(`Opened ${file.name}`);
      } catch {
        setError("Could not open presentation");
      } finally {
        setOpening(false);
      }
    },
    [onOpenPptx],
  );

  useEffect(() => {
    let disposed = false;
    let unsub: (() => void) | null = null;
    let retryHandle: number | null = null;

    const wire = () => {
      if (disposed) return;
      const w = window as unknown as { univer?: Univer };
      const univer = w.univer;
      if (!univer) {
        retryHandle = window.setTimeout(wire, 200);
        return;
      }
      try {
        const instances = univer.__getInjector().get(IUniverInstanceService);
        const model = instances.getCurrentUnitOfType<SlideDataModel>(
          UniverInstanceType.UNIVER_SLIDE,
        );
        if (!model) {
          retryHandle = window.setTimeout(wire, 200);
          return;
        }
        const seedActive = model.getActivePage();
        if (seedActive) {
          const order = model.getPageOrder() ?? [];
          const idx = order.indexOf(seedActive.id);
          if (idx >= 0) setActiveSlideIndex(idx);
        }
        const sub = model.activePage$.subscribe((page) => {
          if (disposed || !page) return;
          const order = model.getPageOrder() ?? [];
          const idx = order.indexOf(page.id);
          if (idx >= 0) setActiveSlideIndex(idx);
        });
        unsub = () => sub.unsubscribe();
      } catch {
        retryHandle = window.setTimeout(wire, 200);
      }
    };
    wire();
    return () => {
      disposed = true;
      if (retryHandle != null) window.clearTimeout(retryHandle);
      unsub?.();
    };
  }, [snapshot.id]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      applySlideZoom(zoom);
      if (zoom === 100) scheduleScrollSlideToCenter();
      else scheduleScaleAwareRecenter();
    }, 120);
    return () => window.clearTimeout(t);
  }, [zoom, snapshot.id]);

  useEffect(() => {
    const PANE_FIT_PCT = 85;
    const handler = (e: Event) => {
      const open = (e as CustomEvent<{ open: boolean }>).detail?.open;
      if (open) {
        if (zoomStateRef.current.priorZoom == null) {
          zoomStateRef.current.priorZoom = zoom;
        }
        const target = Math.min(zoom, PANE_FIT_PCT);
        applySlideZoom(target);
        setZoom(target);
      } else {
        const restore = zoomStateRef.current.priorZoom ?? zoom;
        zoomStateRef.current.priorZoom = null;
        applySlideZoom(restore);
        setZoom(restore);
      }
      scheduleScaleAwareRecenter();
    };
    window.addEventListener("cs:format-pane", handler);
    return () => window.removeEventListener("cs:format-pane", handler);
  }, [zoom, snapshot.id]);

  useEffect(() => {
    const handler = () => scheduleScrollSlideToCenter();
    window.addEventListener("cs:slide-rail", handler);
    return () => window.removeEventListener("cs:slide-rail", handler);
  }, [snapshot.id]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      if (detail?.message) setStatus(detail.message);
    };
    window.addEventListener("cs:status", handler);
    return () => window.removeEventListener("cs:status", handler);
  }, []);

  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(null), 3500);
    return () => window.clearTimeout(t);
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__casualSlides_toggleNotes = () =>
      setNotesVisible((v) => !v);
    window.__casualSlides_openSlideshow = () =>
      setStatus("Slideshow is not available in Hex yet");
    return () => {
      delete window.__casualSlides_toggleNotes;
      delete window.__casualSlides_openSlideshow;
    };
  }, []);

  useSlideKeyboardShortcuts({
    onSave: () => void handleSave(),
    onFitToWindow: handleFitToWindow,
    setZoom,
    onOpen: onOpenPptx ? handleOpenPptx : undefined,
    onSlideshow: () => setStatus("Slideshow is not available in Hex yet"),
  });

  useEffect(
    () => () => {
      if (persistTimerRef.current != null) {
        window.clearTimeout(persistTimerRef.current);
      }
    },
    [],
  );

  const isSaving = saving || savingProp;

  return (
    <div
      className="hex-slides-shell flex h-full min-h-0 flex-col overflow-hidden bg-[var(--cs-bg,#f8f9fa)]"
      data-theme={appearance === "dark" ? "dark" : undefined}
    >
      <input
        ref={openInputRef}
        type="file"
        accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(event) => void handleOpenFileChange(event)}
      />
      <TitleBar
        brand={brand}
        fileName={fileName}
        onFileNameChange={onFileNameChange}
        onOpen={onOpenPptx ? handleOpenPptx : () => setStatus("Use Hex home to open another file")}
        onSave={() => void handleSave()}
        onDownload={() => void onDownload()}
        onOpenProperties={() => setStatus("Properties not available yet")}
        onOpenRecent={() => setStatus("Recent files not available in Hex")}
        onOpenAbout={() => setStatus("Hex presentations")}
        onOpenPageSetup={() => setStatus("Page setup not available yet")}
        onDownloadPng={() => setStatus("PNG export not available yet")}
        onDownloadPdf={() => window.print()}
        onMakeCopy={handleMakeCopy}
        onToggleNotes={() => setNotesVisible((v) => !v)}
        onFitToWindow={handleFitToWindow}
        onZoomIn={() => setZoom((z) => Math.min(400, z + 10))}
        onZoomOut={() => setZoom((z) => Math.max(25, z - 10))}
        onToggleSlidePanel={handleToggleSlidePanel}
        onInsertShape={handleInsertShape}
        onDismissStatus={() => setStatus(null)}
        onDismissError={() => setError(null)}
        saving={isSaving}
        opening={opening}
        dirty={dirty}
        status={status}
        error={error}
      />
      <Toolbar />
      <div className="cs-workspace min-h-0 flex-1">
        <HexSlides
          key={snapshot.id}
          snapshot={snapshot}
          onReady={(api) => {
            apiRef.current = api;
            onReady?.(api);
          }}
          onChange={schedulePersist}
        />
      </div>
      <NotesPanel
        visible={notesVisible}
        onToggle={() => setNotesVisible((v) => !v)}
      />
      <StatusBar
        slideCount={slideCount}
        activeSlideIndex={activeSlideIndex}
        zoom={zoom}
        onZoomChange={setZoom}
        notesVisible={notesVisible}
        onToggleNotes={() => setNotesVisible((v) => !v)}
      />
    </div>
  );
}

declare global {
  interface Window {
    __casualSlides_openSlideshow?: () => void;
    __casualSlides_toggleNotes?: () => void;
  }
}

export function HexSlidesShell(props: HexSlidesShellProps) {
  return (
    <>
      <HexSlidesShellInner {...props} />
      <SlideRailProvider />
      <FormatPaneProvider />
      <ElementContextMenu />
    </>
  );
}

export { getCurrentSnapshot };
