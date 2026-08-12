"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EditorKind } from "@/lib/kinds";
import {
  deleteFile,
  listRecent,
  renameFile,
  type HexFileMeta,
} from "@/lib/storage";
import { useLandingActions } from "@/components/hex/landing/landing-shell";

const KIND_LABEL: Record<EditorKind, string> = {
  docs: "Document",
  sheets: "Spreadsheet",
  slides: "Presentation",
  pdf: "PDF",
};

function formatUpdated(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FileRow({
  file,
  editing,
  draft,
  onDraftChange,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onOpen,
  onRemove,
}: {
  file: HexFileMeta;
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  return (
    <li className="hex-marketing-card flex items-center gap-3 px-3 py-2.5 sm:px-4">
      <div className="min-w-0 flex-1">
        {editing ? (
          <Input
            ref={inputRef}
            aria-label="Rename file"
            className="h-8 bg-background text-sm text-foreground"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={() => onCommitEdit()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCommitEdit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                onCancelEdit();
              }
            }}
          />
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="block w-full truncate text-left text-sm font-medium text-foreground hover:underline"
          >
            {file.name}
          </button>
        )}
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {KIND_LABEL[file.kind]} · {formatUpdated(file.updatedAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!editing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={onStartEdit}
          >
            Rename
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={onOpen}
        >
          Open
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}

export function FilesDashboard() {
  const router = useRouter();
  const { getStarted } = useLandingActions();
  const [files, setFiles] = useState<HexFileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const refresh = useCallback(async () => {
    const rows = await listRecent(200);
    setFiles(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openFile = useCallback(
    (file: HexFileMeta) => {
      router.push(`/editor/${file.kind}?id=${encodeURIComponent(file.id)}`);
    },
    [router],
  );

  const commitRename = useCallback(async () => {
    if (!editingId) return;
    const next = draft.trim();
    if (next) {
      await renameFile(editingId, next);
      await refresh();
    }
    setEditingId(null);
  }, [draft, editingId, refresh]);

  const removeFile = useCallback(
    async (id: string) => {
      await deleteFile(id);
      if (editingId === id) setEditingId(null);
      await refresh();
    },
    [editingId, refresh],
  );

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading your files…</p>
    );
  }

  if (files.length === 0) {
    return (
      <div className="hex-marketing-card px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">No files yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Open or create a document and it will show up here.
        </p>
        <Button
          type="button"
          className="mt-4"
          size="sm"
          onClick={getStarted}
        >
          Get started
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <FileRow
          key={file.id}
          file={file}
          editing={editingId === file.id}
          draft={draft}
          onDraftChange={setDraft}
          onStartEdit={() => {
            setEditingId(file.id);
            setDraft(file.name);
          }}
          onCommitEdit={() => void commitRename()}
          onCancelEdit={() => setEditingId(null)}
          onOpen={() => openFile(file)}
          onRemove={() => void removeFile(file.id)}
        />
      ))}
    </ul>
  );
}
