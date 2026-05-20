import Link from "next/link";
import { notFound } from "next/navigation";
import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { formatBytes } from "@/shared/lib/format-bytes";
import { parseStorageUsageEntries } from "@/shared/lib/storage-usage-links";
import { Card } from "@/shared/ui/card";
import { FadeIn } from "@/shared/ui/fade-in";

const emptyStats = {
  periodDays: 30,
  generatedAt: new Date().toISOString(),
  storageUsageTop: [],
  uploadLeaders: [],
  suspiciousTraffic: [],
  mostLoadedFolders: [],
  inactiveAccounts: [],
};

const metricMap = {
  storageUsageTop: "Storage usage (top)",
  uploadLeaders: "Upload leaders",
  suspiciousTraffic: "Suspicious traffic",
  inactiveAccounts: "Inactive accounts",
  mostLoadedFolders: "Most loaded folders",
} as const;

type Metric = keyof typeof metricMap;

export default async function StatisticListPage({
  params,
}: {
  params: Promise<{ metric: string }>;
}) {
  const { metric } = await params;
  if (!(metric in metricMap)) return notFound();

  const key = metric as Metric;
  const token = await requireAdminToken();
  const stats = await adminApi.getStatistics(token).catch(() => emptyStats);
  const rows = parseStorageUsageEntries(stats[key] as unknown[]);

  return (
    <FadeIn>
      <section className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{metricMap[key]}</h1>
          <p className="text-sm text-muted">
            Список из статистики. У записей есть переход в users, а если API вернул `userId/storageId` -
            также прямой переход в конкретный storage.
          </p>
        </header>

        <Card className="overflow-hidden p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted">Список пуст.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((row, i) => {
                const emailQuery = row.email ?? (row.label.includes("@") ? row.label : "");
                const userHref = row.userId
                  ? `/admin/users/${row.userId}`
                  : `/admin/users${emailQuery ? `?email=${encodeURIComponent(emailQuery)}` : ""}`;
                const storageHref =
                  row.userId && row.storageId
                    ? `/admin/users/${row.userId}/storage/${row.storageId}`
                    : null;

                return (
                  <li key={`${row.label}-${i}`} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.label}</p>
                      <p className="text-xs text-muted">
                        {key === "storageUsageTop" ? formatBytes(row.value) : row.value}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={userHref}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/50 hover:bg-surface-hover"
                      >
                        К пользователю
                      </Link>
                      <Link
                        href={emailQuery ? `/admin/users?email=${encodeURIComponent(emailQuery)}` : "/admin/users"}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/50 hover:bg-surface-hover"
                      >
                        К списку users
                      </Link>
                      {storageHref ? (
                        <Link
                          href={storageHref}
                          className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-400"
                        >
                          К storage
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>
    </FadeIn>
  );
}
