"use client";

import type { EditorKind } from "@/lib/kinds";
import { PRODUCT_ITEMS } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SplitPrimaryButton } from "@/components/hex/landing/split-cta";

const CREATE_LABEL: Record<EditorKind, string> = {
  docs: "New document",
  sheets: "New spreadsheet",
  slides: "New presentation",
  pdf: "New PDF",
};

export function GetStartedDialog({
  open,
  onClose,
  onOpenFile,
  onCreateNew,
  onGenerateSlides,
}: {
  open: boolean;
  onClose: () => void;
  onOpenFile: () => void;
  onCreateNew: (kind: EditorKind) => void;
  onGenerateSlides?: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[34rem]">
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Get started
          </DialogTitle>
          <DialogDescription>
            Open a file from your device or create a blank workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <button
            type="button"
            onClick={onOpenFile}
            className="hex-marketing-card flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-foreground"
          >
            <span>Open file</span>
            <span className="text-xs font-normal text-muted-foreground">
              DOCX · XLSX · PPTX · PDF
            </span>
          </button>

          {onGenerateSlides ? (
            <SplitPrimaryButton
              label="Design a presentation"
              onClick={onGenerateSlides}
              className="w-full"
            />
          ) : null}

          <div>
            <Label className="mb-2.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Create new
            </Label>
            <ul className="grid gap-2 sm:grid-cols-2">
              {PRODUCT_ITEMS.map((item) => (
                <li key={item.kind}>
                  <button
                    type="button"
                    className="hex-marketing-card w-full px-4 py-3.5 text-left"
                    onClick={() => onCreateNew(item.kind)}
                  >
                    <p className="text-sm font-medium text-foreground">
                      {CREATE_LABEL[item.kind]}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
