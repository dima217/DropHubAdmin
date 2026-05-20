import Link from "next/link";
import { Card } from "@/shared/ui/card";
import { AdminStatistics } from "@/shared/types/admin";
import { formatBytes } from "@/shared/lib/format-bytes";
import { normalizeStatRows } from "@/shared/lib/normalize-stat-row";

type Props = { stats: AdminStatistics };

function sumValues(rows: { value: number }[]) {
  return rows.reduce((a, r) => a + (Number.isFinite(r.value) ? r.value : 0), 0);
}

export function StatsOverview({ stats }: Props) {
  const storageRows = normalizeStatRows(stats.storageUsageTop as unknown[]);
  const uploadRows = normalizeStatRows(stats.uploadLeaders as unknown[]);
  const trafficRows = normalizeStatRows(stats.suspiciousTraffic as unknown[]);
  const inactiveRows = normalizeStatRows(stats.inactiveAccounts as unknown[]);
  const folderRows = normalizeStatRows(stats.mostLoadedFolders as unknown[]);

  const storageSum = sumValues(storageRows);
  const uploadSum = sumValues(uploadRows);

  const cards = [
    {
      label: "Storage usage (top)",
      primary: storageRows.length ? formatBytes(storageSum) : "—",
      hint: storageRows.length ? `${storageRows.length} в топе` : "Нет данных",
      href: "/admin/statistics/storageUsageTop",
    },
    {
      label: "Upload leaders",
      primary: uploadRows.length ? String(Math.round(uploadSum)) : "—",
      hint: uploadRows.length ? `${uploadRows.length} пользователей в списке` : "Нет данных",
      href: "/admin/statistics/uploadLeaders",
    },
    {
      label: "Suspicious traffic",
      primary: trafficRows.length ? String(trafficRows.length) : "—",
      hint: "Флаги / события в периоде",
      href: "/admin/statistics/suspiciousTraffic",
    },
    {
      label: "Inactive accounts",
      primary: inactiveRows.length ? String(inactiveRows.length) : "—",
      hint: "Аккаунты без активности",
      href: "/admin/statistics/inactiveAccounts",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => (
        <Link key={item.label} href={item.href} className="block">
          <Card className="transition hover:border-blue-500/60">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{item.primary}</p>
            <p className="mt-1 text-xs text-muted">{item.hint} • Нажмите, чтобы открыть список</p>
          </Card>
        </Link>
      ))}
      {folderRows.length > 0 ? (
        <Card className="sm:col-span-2 xl:col-span-4">
          <Link href="/admin/statistics/mostLoadedFolders" className="text-sm text-muted hover:text-blue-500">
            Most loaded folders
          </Link>
          <p className="mt-2 text-lg font-medium text-foreground">{folderRows.length} папок в топе</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {folderRows.slice(0, 6).map((r) => (
              <Link
                key={r.label}
                href="/admin/statistics/mostLoadedFolders"
                className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-foreground transition hover:border-blue-500/60"
              >
                <span className="text-muted">{r.label}</span>
                <span className="ml-2 font-mono text-blue-500">{r.value}</span>
              </Link>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
