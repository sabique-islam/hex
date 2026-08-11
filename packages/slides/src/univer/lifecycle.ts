import type { Univer } from "@univerjs/core";

const disposedUnivers = new WeakSet<Univer>();
const pendingDispose = new Map<Univer, number>();

let pendingUniver: Univer | null = null;

/** Defer Univer teardown until after React effect cleanups (child → parent) finish. */
export function scheduleUniverDispose(univer: Univer): void {
  if (disposedUnivers.has(univer)) return;

  const existing = pendingDispose.get(univer);
  if (existing != null) window.clearTimeout(existing);

  const timer = window.setTimeout(() => {
    pendingDispose.delete(univer);
    if (disposedUnivers.has(univer)) return;
    disposedUnivers.add(univer);
    try {
      univer.dispose();
    } catch {
      /* already disposed */
    }
  }, 0);

  pendingDispose.set(univer, timer);
}

export function clearWindowUniver(univer: Univer): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { univer?: Univer };
  if (w.univer === univer) w.univer = undefined;
}

/** HexSlides marks the instance; HexSlidesShell flushes after rail/pane unmount. */
export function markUniverForDispose(univer: Univer): void {
  pendingUniver = univer;
}

export function flushPendingUniverDispose(): void {
  const univer = pendingUniver;
  pendingUniver = null;
  if (univer) scheduleUniverDispose(univer);
}
