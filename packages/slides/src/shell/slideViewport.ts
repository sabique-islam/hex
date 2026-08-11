import type { Univer } from "@univerjs/core";
import {
  IUniverInstanceService,
  UniverInstanceType,
} from "@univerjs/core";
import type { SlideDataModel } from "@univerjs/slides";
import { SLIDE_KEY } from "@univerjs/slides";
import { IRenderManagerService } from "@univerjs/engine-render";

function getUniver(): Univer | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { univer?: Univer }).univer ?? null;
}

export function getSlideRenderUnit() {
  const univer = getUniver();
  if (!univer) return null;
  try {
    const instances = univer.__getInjector().get(IUniverInstanceService);
    const model = instances.getCurrentUnitOfType<SlideDataModel>(
      UniverInstanceType.UNIVER_SLIDE,
    );
    if (!model) return null;
    const unitId = model.getUnitId();
    return univer.__getInjector().get(IRenderManagerService).getRenderById(unitId);
  } catch {
    return null;
  }
}

/** Univer's built-in centering — correct at scale=1 (default fit). */
export function scrollSlideToCenter() {
  const renderUnit = getSlideRenderUnit();
  if (!renderUnit) return;
  try {
    renderUnit.engine?.resize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scene = (renderUnit as any).scene;
    if (!scene) return;
    const viewMain = scene.getViewport?.(SLIDE_KEY.VIEW);
    if (!viewMain) return;
    const sceneW = scene.width ?? 0;
    const sceneH = scene.height ?? 0;
    const canvasW = renderUnit.engine?.width ?? 0;
    const canvasH = renderUnit.engine?.height ?? 0;
    const left = (sceneW - canvasW) / 2;
    const top = (sceneH - canvasH) / 2;
    const { x, y } = viewMain.transViewportScroll2ScrollValue(left, top);
    viewMain.scrollToBarPos({ x, y });
  } catch {
    /* render unit gone */
  }
}

/**
 * Scale-aware centering for custom zoom (format pane shrink, user zoom).
 * Univer's scrollToCenter ignores scene scale.
 */
export function scaleAwareRecenter() {
  const renderUnit = getSlideRenderUnit();
  if (!renderUnit) return;
  try {
    renderUnit.engine?.resize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scene = (renderUnit as any).scene;
    if (!scene) return;
    const scale = scene.scaleX ?? 1;
    const viewMain = scene.getViewport?.(SLIDE_KEY.VIEW);
    if (!viewMain) return;
    const sceneW = scene.width;
    const sceneH = scene.height;
    const canvasW = renderUnit.engine?.width ?? 0;
    const canvasH = renderUnit.engine?.height ?? 0;
    const left = (sceneW - canvasW / scale) / 2;
    const top = (sceneH - canvasH / scale) / 2;
    const { x, y } = viewMain.transViewportScroll2ScrollValue(left, top);
    viewMain.scrollToBarPos({ x, y });
  } catch {
    /* render unit gone */
  }
}

export function applySlideZoom(percent: number) {
  const renderUnit = getSlideRenderUnit();
  if (!renderUnit) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scene = (renderUnit as any).scene;
    const f = percent / 100;
    scene?.scale?.(f, f);
  } catch {
    /* ignore */
  }
}

function scheduleRecenter(recenter: () => void) {
  recenter();
  window.setTimeout(recenter, 120);
  window.setTimeout(recenter, 260);
  window.setTimeout(recenter, 420);
}

/** After layout transitions at default zoom (slide rail, resize). */
export function scheduleScrollSlideToCenter() {
  scheduleRecenter(scrollSlideToCenter);
}

/** After format-pane zoom changes. */
export function scheduleScaleAwareRecenter() {
  scheduleRecenter(scaleAwareRecenter);
}
