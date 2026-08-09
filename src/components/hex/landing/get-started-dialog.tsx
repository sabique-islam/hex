"use client";

import type { EditorKind } from "@/lib/kinds";
import { PRODUCT_ITEMS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
      <DialogContent className="gap-0 p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="text-[20px] font-semibold">
            Get started
          </DialogTitle>
          <DialogDescription className="text-[14px]">
            Open a file from your device or create a blank workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          <Button
            type="button"
            variant="outline"
            onClick={onOpenFile}
            className="h-auto w-full justify-between rounded-[9px] px-4 py-3 text-[15px] font-medium"
          >
            <span>Open file</span>
            <span className="text-[13px] font-normal text-muted-foreground">
              DOCX | XLSX | PPTX | PDF
            </span>
          </Button>

          {onGenerateSlides ? (
            <Button
              type="button"
              onClick={onGenerateSlides}
              className="h-auto w-full justify-between rounded-[9px] px-4 py-3 text-[15px] font-medium"
            >
              <span>Design a presentation</span>
              <span className="text-[13px] font-normal text-primary-foreground/80">
                AI · templates
              </span>
            </Button>
          ) : null}

          <div>
            <Label className="mb-3 text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
              Create new
            </Label>
            <ul className="grid gap-2 sm:grid-cols-2">
              {PRODUCT_ITEMS.map((item) => (
                <li key={item.kind}>
                  <Card
                    size="sm"
                    className="cursor-pointer rounded-[9px] py-4 transition-colors hover:bg-accent"
                    onClick={() => onCreateNew(item.kind)}
                  >
                    <CardHeader className="gap-1 px-4">
                      <CardTitle className="text-[15px]">
                        {CREATE_LABEL[item.kind]}
                      </CardTitle>
                      <CardDescription className="text-[13px]">
                        {item.label}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
