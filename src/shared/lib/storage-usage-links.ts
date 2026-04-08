type Entry = { label: string; value: number; userId?: string; storageId?: string; email?: string };

export function parseStorageUsageEntries(rows: unknown[] | undefined | null): Entry[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row, index) => {
    if (!row || typeof row !== "object") return { label: `#${index + 1}`, value: 0 };
    const o = row as Record<string, unknown>;

    const label = pickString(o, ["label", "name", "email", "userId", "id"]) ?? `#${index + 1}`;
    const value = pickNumber(o, ["value", "usedBytes", "count", "size", "total", "uploads"]) ?? 0;
    const email = pickString(o, ["email", "userEmail"]);
    const userId = pickString(o, ["userId", "user_id"]);
    const storageId = pickString(o, ["storageId", "storage_id"]);

    return { label, value, email: email ?? undefined, userId: userId ?? undefined, storageId: storageId ?? undefined };
  });
}

function pickString(o: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const val = o[key];
    if (val == null) continue;
    const str = String(val).trim();
    if (str) return str;
  }
  return null;
}

function pickNumber(o: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const val = o[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim()) {
      const n = Number(val);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}
