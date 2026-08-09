"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import {
  LocaleType,
  LogLevel,
  Univer,
  UniverInstanceType,
  IUniverInstanceService,
} from "@univerjs/core";
import type { ISlideData, SlideDataModel } from "@univerjs/slides";
import { defaultTheme } from "@univerjs/themes";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverDocsHyperLinkPlugin } from "@univerjs/docs-hyper-link";
import { UniverDocsHyperLinkUIPlugin } from "@univerjs/docs-hyper-link-ui";
import { UniverDrawingPlugin } from "@univerjs/drawing";
import { UniverSlidesPlugin } from "@univerjs/slides";
import { UniverSlidesUIPlugin } from "@univerjs/slides-ui";

import { LOCALES } from "./locale";
import { DEFAULT_SLIDE_DATA } from "./default-slide";
import { importPptxToSlides } from "./pptx/pptx-import";
import { exportSlidesToPptx } from "./pptx/pptx-export";
import { loadFontsForSnapshot } from "./pptx/fonts-loader";

export interface HexSlidesApi {
  getSnapshot(): ISlideData | null;
  exportPptx(): Promise<Blob>;
  importPptx(bytes: ArrayBuffer, fileName?: string): Promise<void>;
}

export interface HexSlidesProps {
  /** Initial deck. Defaults to a blank title slide. */
  snapshot?: ISlideData;
  /** Optional pptx bytes to import on mount (overrides snapshot). */
  pptxBytes?: ArrayBuffer | null;
  pptxFileName?: string;
  className?: string;
  style?: CSSProperties;
  onReady?: (api: HexSlidesApi) => void;
}

export const HexSlides = forwardRef<HexSlidesApi, HexSlidesProps>(
  function HexSlides(
    { snapshot, pptxBytes, pptxFileName, className, style, onReady },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const univerRef = useRef<Univer | null>(null);
    const deckKeyRef = useRef(0);
    const mountGenerationRef = useRef(0);

    const getSnapshot = (): ISlideData | null => {
      const univer = univerRef.current;
      if (!univer) return null;
      const instances = univer.__getInjector().get(IUniverInstanceService);
      const model = instances.getCurrentUnitOfType<SlideDataModel>(
        UniverInstanceType.UNIVER_SLIDE,
      );
      return model?.getSnapshot() ?? null;
    };

    const api: HexSlidesApi = {
      getSnapshot,
      async exportPptx() {
        const snap = getSnapshot();
        if (!snap) throw new Error("No slide deck loaded");
        return exportSlidesToPptx(snap);
      },
      async importPptx(bytes, fileName = "deck.pptx") {
        const next = await importPptxToSlides(bytes, fileName);
        await loadFontsForSnapshot(next);
        // Remount by bumping key via parent — for in-place, dispose + recreate unit
        const univer = univerRef.current;
        if (!univer || !containerRef.current) return;
        const instances = univer.__getInjector().get(IUniverInstanceService);
        const existing = instances.getCurrentUnitOfType(
          UniverInstanceType.UNIVER_SLIDE,
        );
        if (existing) {
          instances.disposeUnit(existing.getUnitId());
        }
        univer.createUnit<ISlideData, SlideDataModel>(
          UniverInstanceType.UNIVER_SLIDE,
          { ...next, id: `${next.id}-${++deckKeyRef.current}` },
        );
      },
    };

    useImperativeHandle(ref, () => api, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let cancelled = false;
      let univer: Univer | null = null;
      const mountId = ++mountGenerationRef.current;

      const scheduleDispose = (instance: Univer) => {
        window.setTimeout(() => {
          try {
            instance.dispose();
          } catch {
            /* Univer may already be torn down */
          }
        }, 0);
      };

      const boot = async () => {
        try {
          let initial = snapshot ?? {
            ...DEFAULT_SLIDE_DATA,
            id: `deck-${Date.now().toString(36)}`,
          };
          if (pptxBytes && pptxBytes.byteLength > 0) {
            initial = await importPptxToSlides(
              pptxBytes,
              pptxFileName ?? "deck.pptx",
            );
            await loadFontsForSnapshot(initial);
          }
          if (
            cancelled ||
            mountId !== mountGenerationRef.current ||
            !containerRef.current
          ) {
            return;
          }

          const instance = new Univer({
            theme: defaultTheme,
            locale: LocaleType.EN_US,
            locales: LOCALES,
            logLevel: LogLevel.WARN,
          });

          instance.registerPlugin(UniverRenderEnginePlugin);
          instance.registerPlugin(UniverUIPlugin, {
            container: containerRef.current,
            header: false,
            toolbar: true,
            footer: false,
            headerMenu: false,
            contextMenu: true,
          });
          instance.registerPlugin(UniverDocsPlugin);
          instance.registerPlugin(UniverDocsUIPlugin);
          instance.registerPlugin(UniverFormulaEnginePlugin);
          instance.registerPlugin(UniverDocsHyperLinkPlugin);
          instance.registerPlugin(UniverDocsHyperLinkUIPlugin);
          instance.registerPlugin(UniverDrawingPlugin);
          instance.registerPlugin(UniverSlidesPlugin);
          instance.registerPlugin(UniverSlidesUIPlugin);

          instance.createUnit<ISlideData, SlideDataModel>(
            UniverInstanceType.UNIVER_SLIDE,
            initial,
          );

          if (
            cancelled ||
            mountId !== mountGenerationRef.current ||
            !containerRef.current
          ) {
            scheduleDispose(instance);
            return;
          }

          univer = instance;
          univerRef.current = instance;
          onReady?.(api);
        } catch (error) {
          console.error("[HexSlides] failed to boot Univer", error);
          if (univer) {
            scheduleDispose(univer);
            univer = null;
            univerRef.current = null;
          }
        }
      };

      void boot();

      return () => {
        cancelled = true;
        const instance = univer ?? univerRef.current;
        univerRef.current = null;
        if (instance) scheduleDispose(instance);
      };
      // Mount once per pptx/snapshot identity — parent remounts via key.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={containerRef}
        className={className ?? "hex-slides-mount"}
        style={{ width: "100%", height: "100%", minHeight: 0, ...style }}
      />
    );
  },
);
