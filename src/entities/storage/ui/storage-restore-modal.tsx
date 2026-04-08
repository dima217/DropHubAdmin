"use client";

import { useState } from "react";
import { StorageItem } from "@/shared/types/admin";
import { Button } from "@/shared/ui/button";

type Props = {
  open: boolean;
  itemName: string;
  folders: StorageItem[];
  onClose: () => void;
  onConfirm: (newParentId: string | null | undefined) => void;
  isLoading: boolean;
};

export function StorageRestoreModal({
  open,
  itemName,
  folders,
  onClose,
  onConfirm,
  isLoading,
}: Props) {
  const [target, setTarget] = useState<string>("root");

  if (!open) return null;

  function submit() {
    if (target === "root") onConfirm(null);
    else if (target === "original") onConfirm(undefined);
    else onConfirm(target);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Закрыть" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Восстановить</h3>
        <p className="mt-1 text-sm text-slate-400">
          Элемент: <span className="text-slate-200">{itemName}</span>
        </p>
        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Целевая папка
        </label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
        >
          <option value="root">Корень storage (newParentId = null)</option>
          <option value="original">Исходный родитель (не передавать newParentId)</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <p className="mt-3 text-xs text-slate-500">
          По документации: null — в root; если поле не передать — бэкенд попытается вернуть в исходного родителя.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button type="button" onClick={submit} disabled={isLoading}>
            {isLoading ? "…" : "Подтвердить"}
          </Button>
        </div>
      </div>
    </div>
  );
}
