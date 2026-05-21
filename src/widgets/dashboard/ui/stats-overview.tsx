import Link from "next/link";
import { Card } from "@/shared/ui/card";
import { AdminStatistics } from "@/shared/types/admin";
import { formatBytes } from "@/shared/lib/format-bytes";

type Props = { stats: AdminStatistics };

export function StatsOverview({ stats }: Props) {
  const totalStorage = stats.storageUsageTop.reduce((s, r) => s + r.usedBytes, 0);
  const totalUploads = stats.uploadLeaders.reduce((s, r) => s + r.uploads, 0);
  const maxScore = stats.suspiciousTraffic.reduce((m, r) => Math.max(m, r.suspiciousScore), 0);
  const inactiveCount = stats.inactiveAccounts.length;

  const cards = [
    {
      label: "Топ по хранилищу",
      primary: stats.storageUsageTop.length ? formatBytes(totalStorage) : "—",
      hint: stats.storageUsageTop.length ? `${stats.storageUsageTop.length} пользователей в топе` : "Нет данных",
      href: "/admin/statistics/storageUsageTop",
      accent: "blue",
    },
    {
      label: "Лидеры загрузок",
      primary: stats.uploadLeaders.length ? String(totalUploads) : "—",
      hint: stats.uploadLeaders.length ? `${stats.uploadLeaders.length} пользователей, ${totalUploads} загрузок` : "Нет данных",
      href: "/admin/statistics/uploadLeaders",
      accent: "green",
    },
    {
      label: "Подозрительный трафик",
      primary: stats.suspiciousTraffic.length ? String(stats.suspiciousTraffic.length) : "—",
      hint: stats.suspiciousTraffic.length ? `Макс. балл: ${maxScore}` : "Нет подозрений",
      href: "/admin/statistics/suspiciousTraffic",
      accent: maxScore >= 50 ? "red" : maxScore >= 20 ? "yellow" : "green",
    },
    {
      label: "Неактивные аккаунты",
      primary: inactiveCount ? String(inactiveCount) : "—",
      hint: inactiveCount ? `${inactiveCount} без активности` : "Нет данных",
      href: "/admin/statistics/inactiveAccounts",
      accent: "slate",
    },
  ] as const;

  const accentBorder: Record<string, string> = {
    blue: "hover:border-blue-500/60",
    green: "hover:border-emerald-500/60",
    red: "hover:border-rose-500/60",
    yellow: "hover:border-amber-500/60",
    slate: "hover:border-slate-500/60",
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => (
        <Link key={item.label} href={item.href} className="block">
          <Card className={`h-full transition ${accentBorder[item.accent]}`}>
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{item.primary}</p>
            <p className="mt-1 text-xs text-muted">{item.hint}</p>
            <p className="mt-2 text-xs text-blue-500">Открыть список →</p>
          </Card>
        </Link>
      ))}

      {stats.mostLoadedFolders.length > 0 ? (
        <Card className="sm:col-span-2 xl:col-span-4">
          <Link href="/admin/statistics/mostLoadedFolders" className="text-sm text-muted hover:text-blue-500">
            Нагруженные папки
          </Link>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.mostLoadedFolders.slice(0, 6).map((r, i) => (
              <Link
                key={i}
                href="/admin/statistics/mostLoadedFolders"
                className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-foreground transition hover:border-blue-500/60"
              >
                <span className="text-muted">{r.folderName ?? r.label ?? `#${i + 1}`}</span>
                <span className="ml-2 font-mono text-blue-500">{r.count ?? r.value ?? 0}</span>
              </Link>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
