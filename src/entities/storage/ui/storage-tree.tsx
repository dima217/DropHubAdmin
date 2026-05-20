"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StorageFilter, StorageItem, StoragePagination } from "@/shared/types/admin";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { StorageRestoreModal } from "@/entities/storage/ui/storage-restore-modal";
import { cn } from "@/shared/lib/cn";

type Props = {
  items: StorageItem[];
  pagination: StoragePagination;
  filter: StorageFilter;
};

const TABS: { id: StorageFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "deleted", label: "Deleted" },
  { id: "pending", label: "Pending delete" },
];

export function StorageTree({ items, pagination, filter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [restoreItem, setRestoreItem] = useState<StorageItem | null>(null);
  const [restoreKey, setRestoreKey] = useState(0);

  const folders = useMemo(
    () => items.filter((i) => i.isDirectory && !i.deletedAt),
    [items],
  );

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, search]);

  function navigate(newFilter: StorageFilter, newPage: number) {
    const sp = new URLSearchParams({ filter: newFilter, page: String(newPage) });
    router.push(`${pathname}?${sp}`);
  }

  const restoreMutation = useMutation({
    mutationFn: async (payload: { itemId: string; newParentId?: string | null }) => {
      const res = await fetch("/api/admin/storage/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed restore");
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.refresh();
      setRestoreItem(null);
    },
  });

  const { page, totalPages, total } = pagination;

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(t.id, 1)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-sm font-medium transition",
                filter === t.id
                  ? "bg-blue-500/15 text-blue-700 ring-1 ring-blue-500/40 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/40"
                  : "text-muted hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-56">
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="search"
            placeholder="Поиск по названию…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-input py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* List */}
      <Card className="space-y-3">
        {displayed.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Нет элементов для выбранного фильтра.</p>
        ) : (
          displayed.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {!item.deletedAt && <Badge>Active</Badge>}
                  {item.deletedAt ? <Badge kind="deleted">Deleted</Badge> : null}
                  {item.permanentDeleteAt ? (
                    <Badge kind="warning">
                      Will be removed at {new Date(item.permanentDeleteAt).toLocaleString()}
                    </Badge>
                  ) : null}
                  {item.fileMeta ? (
                    <span className="text-xs text-muted">
                      {(item.fileMeta.size / 1024).toFixed(1)} KB · {item.fileMeta.mimeType} · {item.fileMeta.downloadCount} скачиваний
                    </span>
                  ) : null}
                </div>
              </div>
              {item.deletedAt ? (
                <Button
                  onClick={() => {
                    setRestoreKey((k) => k + 1);
                    setRestoreItem(item);
                  }}
                >
                  Restore…
                </Button>
              ) : null}
            </div>
          ))
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Всего: <span className="font-medium text-foreground">{total}</span> элементов
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => navigate(filter, page - 1)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Назад
            </button>
            <span className="min-w-[80px] text-center text-sm text-muted">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => navigate(filter, page + 1)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Вперёд →
            </button>
          </div>
        </div>
      )}

      <StorageRestoreModal
        key={restoreItem ? `${restoreItem.id}-${restoreKey}` : "closed"}
        open={!!restoreItem}
        itemName={restoreItem?.name ?? ""}
        folders={folders}
        isLoading={restoreMutation.isPending}
        onClose={() => setRestoreItem(null)}
        onConfirm={(newParentId) => {
          if (!restoreItem) return;
          const itemId = restoreItem.id;
          if (newParentId === null) restoreMutation.mutate({ itemId, newParentId: null });
          else if (newParentId === undefined) restoreMutation.mutate({ itemId });
          else restoreMutation.mutate({ itemId, newParentId });
        }}
      />
    </>
  );
}
