import { useEffect, useRef } from "react";
import type { Univer } from "@univerjs/core";
import {
  IUniverInstanceService,
  UniverInstanceType,
} from "@univerjs/core";
import type { SlideDataModel } from "@univerjs/slides";
import { dispatchSlideCommand } from "../univer/commands";
import { getSelectedElement } from "./selection";

function isSlideTextEditorOpen(): boolean {
  if (typeof document === "undefined") return false;
  const div = document.querySelector(
    "div.univer-absolute.univer-z-10",
  ) as HTMLElement | null;
  if (!div) return false;
  const w = parseFloat(div.style?.width ?? "0");
  return w > 0 && div.children.length > 0;
}

export interface SlideKeyboardShortcutOptions {
  onSave: () => void | Promise<void>;
  onFitToWindow: () => void;
  setZoom: (updater: (prev: number) => number) => void;
  /** Ctrl+O — open file picker when provided. */
  onOpen?: () => void;
  /** F5 — start slideshow when provided. */
  onSlideshow?: () => void;
}

/**
 * Global slide-editor keyboard bindings ported from suite/slides App.tsx.
 * Runs at window scope so shortcuts work while the canvas has focus.
 */
export function useSlideKeyboardShortcuts(
  options: SlideKeyboardShortcutOptions,
): void {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const modHandler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const editorOpen = isSlideTextEditorOpen();
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      const textInputShortcuts = new Set(["z", "y", "c", "x", "v", "a"]);
      if ((inEditable || editorOpen) && textInputShortcuts.has(k)) return;

      const { onSave, onFitToWindow, setZoom, onOpen } = optionsRef.current;

      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        void dispatchSlideCommand("univer.command.undo");
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        void dispatchSlideCommand("univer.command.redo");
      } else if (k === "m") {
        e.preventDefault();
        void dispatchSlideCommand("slide.operation.append-slide");
      } else if (k === "p") {
        e.preventDefault();
        window.print();
      } else if (k === "s") {
        e.preventDefault();
        void onSave();
      } else if (k === "o") {
        e.preventDefault();
        onOpen?.();
      } else if (k === "d") {
        e.preventDefault();
        if (getSelectedElement()) {
          void dispatchSlideCommand("casual-slides.command.duplicate-element");
        } else {
          void dispatchSlideCommand("slide.command.duplicate-slide");
        }
      } else if (k === "c" && getSelectedElement()) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.copy-element");
      } else if (k === "x" && getSelectedElement()) {
        e.preventDefault();
        void (async () => {
          await dispatchSlideCommand("casual-slides.command.copy-element");
          await dispatchSlideCommand("casual-slides.command.delete-element");
        })();
      } else if (k === "v") {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.paste-element");
      } else if (k === "a") {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.select-all-on-page");
      } else if (k === "k") {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.insert-link");
      } else if (k === "]" && e.altKey) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.z-order", {
          direction: "front",
        });
      } else if (k === "[" && e.altKey) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.z-order", {
          direction: "back",
        });
      } else if (k === "]") {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.z-order", {
          direction: "forward",
        });
      } else if (k === "[") {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.z-order", {
          direction: "backward",
        });
      } else if (k === "=" || k === "+") {
        e.preventDefault();
        setZoom((z) => Math.min(400, z + 10));
      } else if (k === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(25, z - 10));
      } else if (k === "0" && e.shiftKey) {
        e.preventDefault();
        onFitToWindow();
      } else if (e.key === "ArrowUp" && e.shiftKey) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.move-active-slide", {
          direction: "up",
        });
      } else if (e.key === "ArrowDown" && e.shiftKey) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.move-active-slide", {
          direction: "down",
        });
      } else if (k === "0") {
        e.preventDefault();
        setZoom(() => 100);
      }
    };

    const deleteSlideHandler = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (inEditable) return;
      if (e.shiftKey) {
        e.preventDefault();
        void dispatchSlideCommand("slide.command.delete-slide");
        return;
      }
      const sel = getSelectedElement();
      if (sel) {
        e.preventDefault();
        void dispatchSlideCommand("casual-slides.command.delete-element");
      }
    };

    const nudgeHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (
        k !== "ArrowUp" &&
        k !== "ArrowDown" &&
        k !== "ArrowLeft" &&
        k !== "ArrowRight"
      )
        return;
      const target = e.target as HTMLElement | null;
      const inFormField =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (inFormField) return;
      const sel = getSelectedElement();
      if (!sel) return;
      const step = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (k === "ArrowUp") dy = -step;
      else if (k === "ArrowDown") dy = step;
      else if (k === "ArrowLeft") dx = -step;
      else if (k === "ArrowRight") dx = step;
      e.preventDefault();
      e.stopPropagation();
      void dispatchSlideCommand("casual-slides.command.nudge-element", {
        dx,
        dy,
      });
    };

    const tabCycleHandler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "SELECT")
      )
        return;
      if (typeof document !== "undefined" && document.querySelector('[role="dialog"]'))
        return;
      e.preventDefault();
      e.stopPropagation();
      void dispatchSlideCommand("casual-slides.command.cycle-selection", {
        direction: e.shiftKey ? "prev" : "next",
      });
    };

    const f5Handler = (e: KeyboardEvent) => {
      if (e.key !== "F5") return;
      e.preventDefault();
      optionsRef.current.onSlideshow?.();
    };

    const pageNavHandler = (e: KeyboardEvent) => {
      if (
        e.key !== "PageUp" &&
        e.key !== "PageDown" &&
        e.key !== "Home" &&
        e.key !== "End"
      )
        return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (typeof document !== "undefined" && document.querySelector('[role="dialog"]'))
        return;
      const w = window as unknown as { univer?: Univer };
      const univer = w.univer;
      if (!univer) return;
      try {
        const instances = univer.__getInjector().get(IUniverInstanceService);
        const model = instances.getCurrentUnitOfType<SlideDataModel>(
          UniverInstanceType.UNIVER_SLIDE,
        );
        if (!model) return;
        const order = model.getPageOrder?.();
        if (!order || order.length === 0) return;
        const activeId = model.getActivePage()?.id;
        const idx = activeId ? order.indexOf(activeId) : 0;
        let nextIdx: number;
        if (e.key === "Home") nextIdx = 0;
        else if (e.key === "End") nextIdx = order.length - 1;
        else if (e.key === "PageDown") nextIdx = idx + 1;
        else nextIdx = idx - 1;
        if (nextIdx < 0 || nextIdx >= order.length || nextIdx === idx) return;
        const nextPage = model.getPage(order[nextIdx]!);
        if (!nextPage) return;
        e.preventDefault();
        model.setActivePage(nextPage);
      } catch {
        /* model torn down */
      }
    };

    const f2Handler = (e: KeyboardEvent) => {
      if (e.key !== "F2") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (typeof document !== "undefined" && document.querySelector('[role="dialog"]'))
        return;
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("cs:rename-filename"));
    };

    const escHandler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (inEditable) return;
      if (typeof document !== "undefined" && document.querySelector('[role="dialog"]'))
        return;
      if (!getSelectedElement()) return;
      e.preventDefault();
      void dispatchSlideCommand("casual-slides.command.clear-selection");
    };

    window.addEventListener("keydown", modHandler);
    window.addEventListener("keydown", f5Handler);
    window.addEventListener("keydown", f2Handler);
    window.addEventListener("keydown", deleteSlideHandler);
    window.addEventListener("keydown", escHandler);
    window.addEventListener("keydown", nudgeHandler, true);
    window.addEventListener("keydown", tabCycleHandler, true);
    window.addEventListener("keydown", pageNavHandler);

    return () => {
      window.removeEventListener("keydown", modHandler);
      window.removeEventListener("keydown", f5Handler);
      window.removeEventListener("keydown", f2Handler);
      window.removeEventListener("keydown", deleteSlideHandler);
      window.removeEventListener("keydown", escHandler);
      window.removeEventListener("keydown", nudgeHandler, true);
      window.removeEventListener("keydown", tabCycleHandler, true);
      window.removeEventListener("keydown", pageNavHandler);
    };
  }, []);
}
