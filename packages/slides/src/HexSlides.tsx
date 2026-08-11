"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import {
  ICommandService,
  IUniverInstanceService,
  LocaleType,
  LogLevel,
  Univer,
  UniverInstanceType,
} from "@univerjs/core";
import type { ISlideData, SlideDataModel } from "@univerjs/slides";
import { defaultTheme } from "@univerjs/themes";
import {
  IRenderManagerService,
  UniverRenderEnginePlugin,
} from "@univerjs/engine-render";
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
import { exportSlidesToPptx } from "./pptx/pptx-export";
import { registerSlideCanvasSync } from "./shell/slideCanvasSync";
import {
  cancelScheduledRecenters,
  scheduleScrollSlideToCenter,
} from "./shell/slideViewport";
import {
  clearWindowUniver,
  flushPendingUniverDispose,
  markUniverForDispose,
} from "./univer/lifecycle";

export interface HexSlidesApi {
  getSnapshot(): ISlideData | null;
  exportPptx(): Promise<Blob>;
}

export interface HexSlidesProps {
  snapshot: ISlideData;
  className?: string;
  style?: CSSProperties;
  onReady?: (api: HexSlidesApi) => void;
  onChange?: () => void;
}

export const HexSlides = forwardRef<HexSlidesApi, HexSlidesProps>(
  function HexSlides({ snapshot, className, style, onReady, onChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const univerRef = useRef<Univer | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const getSnapshot = (): ISlideData | null => {
      const univer = univerRef.current;
      if (!univer) return null;
      const instances = univer.__getInjector().get(IUniverInstanceService);
      const model = instances.getCurrentUnitOfType<SlideDataModel>(
        UniverInstanceType.UNIVER_SLIDE,
      );
      if (!model) return null;
      return model.getSnapshot() ?? null;
    };

    const api: HexSlidesApi = {
      getSnapshot,
      async exportPptx() {
        const snap = getSnapshot();
        if (!snap) throw new Error("No slide deck loaded");
        return exportSlidesToPptx(snap);
      },
    };

    useImperativeHandle(ref, () => api, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const univer = new Univer({
        theme: defaultTheme,
        locale: LocaleType.EN_US,
        locales: LOCALES,
        logLevel: LogLevel.WARN,
      });

      univer.registerPlugin(UniverRenderEnginePlugin);
      univer.registerPlugin(UniverUIPlugin, {
        container,
        header: false,
        toolbar: false,
        footer: false,
        headerMenu: false,
        contextMenu: false,
      });
      univer.registerPlugin(UniverDocsPlugin);
      univer.registerPlugin(UniverDocsUIPlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin);
      univer.registerPlugin(UniverDocsHyperLinkPlugin);
      univer.registerPlugin(UniverDocsHyperLinkUIPlugin);
      univer.registerPlugin(UniverDrawingPlugin);
      univer.registerPlugin(UniverSlidesPlugin);
      univer.registerPlugin(UniverSlidesUIPlugin);

      univer.createUnit<ISlideData, SlideDataModel>(
        UniverInstanceType.UNIVER_SLIDE,
        snapshot,
      );

      if (typeof window !== "undefined") {
        const w = window as unknown as { univer?: Univer };
        w.univer = univer;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__casualSlides__ICommandService = ICommandService;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__casualSlides__IUniverInstanceService =
          IUniverInstanceService;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__casualSlides__IRenderManagerService =
          IRenderManagerService;
      }

      univerRef.current = univer;

      const syncDisposer = registerSlideCanvasSync(univer);

      const cs = univer.__getInjector().get(ICommandService);
      const mutationDisposer = cs.onMutationExecutedForCollab(() => {
        onChangeRef.current?.();
      });
      const commandDisposer = cs.onCommandExecuted((info) => {
        const id = info.id;
        if (!id.startsWith("slide.")) return;
        if (
          id === "slide.operation.activate-slide" ||
          id === "slide.operation.set-slide-page-thumb" ||
          id.includes("text-edit")
        ) {
          return;
        }
        onChangeRef.current?.();
      });

      const recenter = () => {
        scheduleScrollSlideToCenter();
      };

      const t1 = window.setTimeout(recenter, 80);
      const t2 = window.setTimeout(recenter, 400);
      const t3 = window.setTimeout(recenter, 1200);
      const ro = new ResizeObserver(() => recenter());
      ro.observe(container);

      onReady?.(api);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
        ro.disconnect();
        cancelScheduledRecenters();
        syncDisposer();
        mutationDisposer?.dispose?.();
        commandDisposer?.dispose?.();
        univerRef.current = null;
        clearWindowUniver(univer);
        markUniverForDispose(univer);
      };
      // Parent remounts via key={snapshot.id}.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={containerRef}
        className={className ?? "univer-mount"}
        style={{ width: "100%", height: "100%", minHeight: 0, ...style }}
      />
    );
  },
);
