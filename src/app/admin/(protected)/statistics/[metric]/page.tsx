import Link from "next/link";
import { notFound } from "next/navigation";
import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { formatBytes } from "@/shared/lib/format-bytes";
import {
  InactiveAccountEntry,
  StorageUsageEntry,
  SuspiciousTrafficEntry,
  UploadLeaderEntry,
} from "@/shared/types/admin";
import { Card } from "@/shared/ui/card";
import { FadeIn } from "@/shared/ui/fade-in";
import { SuspiciousTrafficList } from "@/widgets/dashboard/ui/suspicious-traffic-list";

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

function UserLink({ userId, email }: { userId: number; email: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-foreground">{email}</p>
        <p className="text-xs text-muted">userId: {userId}</p>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/admin/users/${userId}`}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/50 hover:bg-surface-hover"
        >
          К пользователю
        </Link>
        <Link
          href={`/admin/users?email=${encodeURIComponent(email)}`}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/50 hover:bg-surface-hover"
        >
          К списку users
        </Link>
      </div>
    </div>
  );
}

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

  return (
    <FadeIn>
      <section className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{metricMap[key]}</h1>
          <p className="text-sm text-muted">Период: {stats.periodDays} дней</p>
        </header>

        {key === "suspiciousTraffic" ? (
          <SuspiciousTrafficList rows={stats.suspiciousTraffic as SuspiciousTrafficEntry[]} />
        ) : key === "storageUsageTop" ? (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {(stats.storageUsageTop as StorageUsageEntry[]).map((row) => (
                <li key={row.userId} className="p-4">
                  <UserLink userId={row.userId} email={row.email} />
                  <p className="mt-2 text-sm font-mono text-foreground">{formatBytes(row.usedBytes)}</p>
                </li>
              ))}
            </ul>
          </Card>
        ) : key === "uploadLeaders" ? (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {(stats.uploadLeaders as UploadLeaderEntry[]).map((row) => (
                <li key={row.userId} className="p-4">
                  <UserLink userId={row.userId} email={row.email} />
                  <p className="mt-2 text-sm text-muted">
                    Загрузок: <span className="font-mono font-semibold text-foreground">{row.uploads}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : key === "inactiveAccounts" ? (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {(stats.inactiveAccounts as InactiveAccountEntry[]).map((row) => (
                <li key={row.userId} className="p-4">
                  <UserLink userId={row.userId} email={row.email} />
                  <p className="mt-2 text-xs text-muted">
                    Последняя активность:{" "}
                    <span className="text-foreground">
                      {row.lastActivityAt
                        ? new Date(row.lastActivityAt).toLocaleString("ru-RU")
                        : "Никогда"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted">Нет данных для отображения.</p>
          </Card>
        )}
      </section>
    </FadeIn>
  );
}
