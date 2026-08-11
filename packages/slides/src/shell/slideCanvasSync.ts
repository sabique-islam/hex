import type { Univer } from "@univerjs/core";
import {
  CommandType,
  ICommandService,
  IUniverInstanceService,
  merge,
  UniverInstanceType,
} from "@univerjs/core";
import type { ISlidePage, SlideDataModel } from "@univerjs/slides";
import { PageElementType } from "@univerjs/slides";
import { CanvasView } from "@univerjs/slides-ui";

type SlideRenderControllerLike = {
  createPageScene?: (pageId: string, page: ISlidePage) => unknown;
  _currentRender?: () => {
    mainComponent?: {
      hasPage?: (pageId: string) => boolean;
      removeSubScene?: (pageId: string) => void;
      changePage?: (pageId: string) => void;
    };
  } | null;
};

const registeredCommandServices = new WeakSet<ICommandService>();
const normalizedPages = new Set<string>();

function getLiveUniver(): Univer | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { univer?: Univer }).univer ?? null;
}

function getSlideRenderController(
  univer: Univer,
  unitId: string,
): SlideRenderControllerLike | null {
  try {
    const canvasView = univer.__getInjector().get(CanvasView);
    // CanvasView resolves SlideRenderController internally; not exported in 0.25.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (canvasView as any)._getSlideRenderControllerFromRenderUnit(
      unitId,
    ) as SlideRenderControllerLike | null;
  } catch {
    return null;
  }
}

/** Normalize imported text so Univer's canvas renderer matches SlideTile. */
function normalizePageForCanvas(page: ISlidePage): ISlidePage {
  const pageElements = { ...page.pageElements };
  for (const id of Object.keys(pageElements)) {
    const el = pageElements[id];
    if (!el || el.type !== PageElementType.TEXT || !el.richText) continue;
    const rt = el.richText;
    const stream = rt.rich?.body?.dataStream?.replace(/\0/g, "").trim() ?? "";
    const flat = rt.text?.trim() ?? "";

    // RichTextAdaptor prefers flat `text` when non-null — an empty string
    // blocks the rich document path and the canvas stays blank.
    if (stream && !flat) {
      const clone = structuredClone(el);
      if (clone.richText && "text" in clone.richText) {
        delete (clone.richText as { text?: string }).text;
      }
      pageElements[id] = clone;
      continue;
    }

    const rich = rt.rich;
    const runs = rich?.body?.textRuns;
    if (!runs?.length) continue;
    const clone = structuredClone(el);
    const cloneRuns = clone.richText!.rich!.body!.textRuns!;
    for (const run of cloneRuns) {
      if (!run?.ts) continue;
      if (rt.cl && "rgb" in rt.cl && rt.cl.rgb) {
        run.ts.cl = { rgb: rt.cl.rgb as string };
      }
      if (rt.ff) run.ts.ff = rt.ff;
      if (rt.fs !== undefined) run.ts.fs = rt.fs;
      if (rt.bl !== undefined) run.ts.bl = rt.bl;
    }
    pageElements[id] = clone;
  }
  return { ...page, pageElements };
}

export function refreshElementOnCanvas(
  univer: Univer,
  unitId: string,
  pageId: string,
  elementId: string,
) {
  const instances = univer.__getInjector().get(IUniverInstanceService);
  const model = instances.getUnit<SlideDataModel>(unitId);
  if (!model) return;
  const page = model.getPage(pageId);
  const raw = page?.pageElements?.[elementId];
  if (!raw) return;
  const el = normalizePageForCanvas({
    ...page,
    pageElements: { [elementId]: raw },
  }).pageElements[elementId];
  if (!el) return;
  try {
    const canvasView = univer.__getInjector().get(CanvasView);
    canvasView.removeObjectById(elementId, pageId, unitId);
    canvasView.createObjectToPage(el, pageId, unitId);
  } catch {
    /* canvas refresh best-effort — avoid full scene rebuild during edit */
  }
}

export function rebuildPageScene(
  univer: Univer,
  unitId: string,
  pageId: string,
) {
  const instances = univer.__getInjector().get(IUniverInstanceService);
  const model = instances.getUnit<SlideDataModel>(unitId);
  if (!model) return;
  const page = model.getPage(pageId);
  if (!page) return;
  const ctrl = getSlideRenderController(univer, unitId);
  if (!ctrl?.createPageScene) return;
  const slide = ctrl._currentRender?.()?.mainComponent;
  if (slide?.hasPage?.(pageId) && slide.removeSubScene) {
    slide.removeSubScene(pageId);
  }
  ctrl.createPageScene(pageId, normalizePageForCanvas(page));
  const active = model.getActivePage();
  if (active && active.id === pageId && slide?.changePage) {
    slide.changePage(pageId);
  }
  normalizedPages.add(`${unitId}:${pageId}`);
}

/** Rebuild a page once when first opened — fixes PPTX import canvas gaps. */
export function ensurePageRendered(
  univer: Univer,
  unitId: string,
  pageId: string,
) {
  const key = `${unitId}:${pageId}`;
  if (normalizedPages.has(key)) return;
  rebuildPageScene(univer, unitId, pageId);
}

function syncInitialActivePage(univer: Univer) {
  window.setTimeout(() => {
    const instances = univer.__getInjector().get(IUniverInstanceService);
    const model = instances.getCurrentUnitOfType<SlideDataModel>(
      UniverInstanceType.UNIVER_SLIDE,
    );
    if (!model) return;
    const active = model.getActivePage();
    if (!active) return;
    ensurePageRendered(univer, model.getUnitId(), active.id);
  }, 400);
}

export function registerSlideCanvasSync(univer: Univer): () => void {
  const cs = univer.__getInjector().get(ICommandService);

  if (!registeredCommandServices.has(cs)) {
    registeredCommandServices.add(cs);
    cs.registerCommand({
      id: "slide.mutation.update-element",
      type: CommandType.MUTATION,
      handler: (accessor, params) => {
        if (!params) return false;
        const p = params as {
          unitId: string;
          pageId: string;
          elementId: string;
          props: Record<string, unknown>;
        };
        const model = accessor
          .get(IUniverInstanceService)
          .getUnit<SlideDataModel>(p.unitId);
        if (!model) return false;
        const page = model.getPage(p.pageId);
        if (!page) return false;
        const existing = page.pageElements[p.elementId];
        if (!existing) return false;
        page.pageElements[p.elementId] = merge(existing, p.props);
        model.updatePage(p.pageId, page);
        model.incrementRev();
        const live = getLiveUniver();
        if (live) refreshElementOnCanvas(live, p.unitId, p.pageId, p.elementId);
        return true;
      },
    });
    cs.registerCommand({
      id: "slide.mutation.delete-element",
      type: CommandType.MUTATION,
      handler: (accessor, params) => {
        if (!params) return false;
        const p = params as {
          unitId: string;
          pageId: string;
          elementId: string;
        };
        const model = accessor
          .get(IUniverInstanceService)
          .getUnit<SlideDataModel>(p.unitId);
        if (!model) return false;
        const page = model.getPage(p.pageId);
        if (!page) return false;
        delete page.pageElements[p.elementId];
        model.updatePage(p.pageId, page);
        model.incrementRev();
        try {
          accessor
            .get(CanvasView)
            .removeObjectById(p.elementId, p.pageId, p.unitId);
        } catch {
          /* ignore */
        }
        return true;
      },
    });
  }

  // Background / page-level patches only — do NOT hook
  // slide.operation.update-element here; FormatPane already mutates the live
  // BaseObject in place for transforms, and text edits use the inline doc
  // editor (refreshing the canvas mid-edit breaks rendering + triggers redi
  // Engine warnings).
  const cmdDisposer = cs.onCommandExecuted((info) => {
    if (info.id !== "slide.mutation.update-page") return;
    const p = info.params as
      | { unitId?: string; pageId?: string; patch?: Record<string, unknown> }
      | undefined;
    if (!p?.unitId || !p.pageId) return;
    if (!p.patch || !("pageBackgroundFill" in p.patch)) return;
    const live = getLiveUniver();
    if (live) rebuildPageScene(live, p.unitId, p.pageId);
  });

  normalizedPages.clear();
  syncInitialActivePage(univer);

  return () => {
    cmdDisposer?.dispose?.();
    normalizedPages.clear();
  };
}
