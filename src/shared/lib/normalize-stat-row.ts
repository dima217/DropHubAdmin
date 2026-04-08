/** Coerce unknown API stat rows into chart-friendly { label, value }. */
export function normalizeStatRows(rows: unknown[] | undefined | null): { label: string; value: number }[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  return rows.map((row, index) => {
    if (row == null || typeof row !== "object") {
      return { label: String(index + 1), value: 0 };
    }
    const o = row as Record<string, unknown>;

    const label =
      pickString(o, ["label", "name", "email", "userId", "id", "title", "key"]) ?? `#${index + 1}`;

    const value =
      pickNumber(o, ["value", "count", "uploads", "bytes", "size", "score", "total", "amount"]) ?? 0;

    return { label: String(label), value };
  });
}

function pickString(o: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = o[k];
    if (v != null && v !== "") return String(v);
  }
  return null;
}

function pickNumber(o: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}
