"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  applyEditorAppearance,
  resetEditorAppearance,
  resolveEditorAppearance,
  type EditorAppearance,
} from "@/lib/editor-theme";

function subscribeAppearance(onChange: (next: EditorAppearance) => void) {
  const sync = () => onChange(resolveEditorAppearance());
  sync();

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", sync);

  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  window.addEventListener("storage", sync);

  return () => {
    mql.removeEventListener("change", sync);
    observer.disconnect();
    window.removeEventListener("storage", sync);
  };
}

/** Resolved light/dark for editor embeds (sheets appearance, etc.). */
export function useEditorAppearance(): EditorAppearance {
  const [appearance, setAppearance] = useState<EditorAppearance>("light");

  useEffect(() => {
    return subscribeAppearance((next) => {
      setAppearance((prev) => (prev === next ? prev : next));
    });
  }, []);

  return appearance;
}

/** Applies selected theme to the Hex shell; restores light when leaving editors. */
export function EditorThemeSync() {
  const pathname = usePathname();
  const onEditorRoute = pathname.startsWith("/editor");

  useEffect(() => {
    if (!onEditorRoute) return;
    return subscribeAppearance((next) => {
      applyEditorAppearance(next);
    });
  }, [onEditorRoute]);

  useEffect(() => {
    if (onEditorRoute) return;
    resetEditorAppearance();
  }, [onEditorRoute]);

  useEffect(() => {
    return () => {
      resetEditorAppearance();
    };
  }, []);

  return null;
}
