export type EditorAppearance = "light" | "dark";

export function resolveEditorAppearance(): EditorAppearance {
  if (typeof document === "undefined") return "light";

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;

  try {
    const stored = window.localStorage.getItem("casual-editor:color-theme");
    if (stored === "dark" || stored === "light") return stored;
    if (stored === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  } catch {
    /* private mode */
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyEditorAppearance(appearance: EditorAppearance) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (root.getAttribute("data-theme") !== appearance) {
    root.setAttribute("data-theme", appearance);
  }
  if (root.style.colorScheme !== appearance) {
    root.style.colorScheme = appearance;
  }
  root.classList.toggle("dark", appearance === "dark");
  root.classList.toggle("light", appearance === "light");

  const bg = appearance === "dark" ? "#141414" : "#ffffff";
  if (document.body.style.backgroundColor !== bg) {
    document.body.style.backgroundColor = bg;
  }
}

export function resetEditorAppearance() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.colorScheme = "light";
  root.classList.add("light");
  root.classList.remove("dark");
  document.body.style.backgroundColor = "";
}
