"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { StorageItem } from "@/shared/types/admin";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { StorageRestoreModal } from "@/entities/storage/ui/storage-restore-modal";

type Props = { items: StorageItem[] };

type Filter = "all" | "deleted" | "pending";

export function StorageTree({ items }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [restoreItem, setRestoreItem] = useState<StorageItem | null>(null);
  const [restoreKey, setRestoreKey] = useState(0);

  const folders = useMemo(
    () => items.filter((i) => i.isDirectory && !i.deletedAt),
    [items],
  );

  const filtered = useMemo(() => {
    if (filter === "deleted") return items.filter((i) => i.deletedAt);
    if (filter === "pending") return items.filter((i) => i.permanentDeleteAt);
    return items;
  }, [items, filter]);

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

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "deleted", label: "Deleted" },
    { id: "pending", label: "Pending delete" },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              filter === t.id
                ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/40"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Нет элементов для выбранного фильтра.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 p-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-100">{item.name}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {!item.deletedAt && <Badge>Active</Badge>}
                  {item.deletedAt ? <Badge kind="deleted">Deleted</Badge> : null}
                  {item.permanentDeleteAt ? (
                    <Badge kind="warning">Will be removed at {new Date(item.permanentDeleteAt).toLocaleString()}</Badge>
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
