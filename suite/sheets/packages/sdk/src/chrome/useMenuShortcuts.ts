/**
 * Global Excel-style keyboard bindings for `<CasualSheets chrome="full">`.
 * Ported from apps/web MenuBar capture handler; lives in the SDK so Hex and
 * other embed hosts get working shortcuts without shipping their own shell.
 */
import { useEffect, useRef } from 'react';
import type { CasualSheetsAPI } from '../sheets/api';
import { useDialogs } from './dialog-context';

function inTextInput(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement | null)?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA';
}

export interface MenuShortcutOptions {
  onOpenFindReplace?: (replaceMode: boolean) => void;
}

export function useMenuShortcuts(
  api: CasualSheetsAPI | null,
  options?: MenuShortcutOptions,
): void {
  const { openDialog } = useDialogs();
  const apiRef = useRef(api);
  apiRef.current = api;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const run = (fn: (api: CasualSheetsAPI) => void) => {
      const live = apiRef.current;
      if (live) fn(live);
    };

    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      const inInput = inTextInput(e);

      if (mod && !e.altKey) {
        if (k === 'z' && !e.shiftKey) {
          e.preventDefault();
          run((a) => void a.executeCommand('univer.command.undo'));
          return;
        }
        if ((k === 'z' && e.shiftKey) || k === 'y') {
          e.preventDefault();
          run((a) => void a.executeCommand('univer.command.redo'));
          return;
        }
        if (k === 'x' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('univer.command.cut'));
          return;
        }
        if (k === 'c' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('univer.command.copy'));
          return;
        }
        if (k === 'v' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('univer.command.paste'));
          return;
        }
        if (k === 'b' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('sheet.command.set-range-bold'));
          return;
        }
        if (k === 'i' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('sheet.command.set-range-italic'));
          return;
        }
        if (k === 'u' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('sheet.command.set-range-underline'));
          return;
        }
        if (k === 'f' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          optionsRef.current?.onOpenFindReplace?.(false);
          return;
        }
        if (k === 'h' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          optionsRef.current?.onOpenFindReplace?.(true);
          return;
        }
        if (k === 'k' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => void a.executeCommand('sheet.operation.insert-hyper-link'));
          return;
        }
        if (k === '/' && !e.shiftKey) {
          e.preventDefault();
          openDialog('keyboard-shortcuts');
          return;
        }
        if (e.key === 'PageUp' && !e.shiftKey) {
          e.preventDefault();
          run((a) => {
            const wb = a.univer.getActiveWorkbook();
            const active = wb?.getActiveSheet();
            if (!wb || !active) return;
            const sheets = wb.getSheets();
            const idx = sheets.findIndex((s) => s.getSheetId() === active.getSheetId());
            if (idx > 0) wb.setActiveSheet(sheets[idx - 1]!);
          });
          return;
        }
        if (e.key === 'PageDown' && !e.shiftKey) {
          e.preventDefault();
          run((a) => {
            const wb = a.univer.getActiveWorkbook();
            const active = wb?.getActiveSheet();
            if (!wb || !active) return;
            const sheets = wb.getSheets();
            const idx = sheets.findIndex((s) => s.getSheetId() === active.getSheetId());
            if (idx >= 0 && idx < sheets.length - 1) wb.setActiveSheet(sheets[idx + 1]!);
          });
          return;
        }
        if (e.key === 'Home' && !e.shiftKey) {
          if (inInput) return;
          e.preventDefault();
          run((a) => a.univer.getActiveWorkbook()?.getActiveSheet()?.getRange(0, 0).activate());
        }
      }

      if (e.key === 'F2' && !mod && !e.shiftKey && !e.altKey) {
        if (inInput) return;
        e.preventDefault();
        run((a) => void a.executeCommand('sheet.operation.set-cell-edit-visible', { visible: true }));
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [openDialog]);
}
