"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { resetEditorAppearance } from "@/lib/editor-theme";

/** Reset editor theme + body classes whenever we leave `/editor/*`. */
export function RouteChromeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname.startsWith("/editor")) return;
    resetEditorAppearance();
  }, [pathname]);

  return null;
}
