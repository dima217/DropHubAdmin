import Link from "next/link";
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

export default async function StorageUsagePage() {
  const token = await requireAdminToken();
  const stats = await adminApi.getStatistics(token).catch(() => emptyStats);
  const rows = parseStorageUsageEntries(stats.storageUsageTop as unknown[]);

  return (
    <FadeIn>
      <section className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Storage usage top</h1>
          <p className="text-sm text-slate-500">
            Клик по записи ведет в список пользователей или сразу в карточку/storage, если в ответе есть нужные id.
          </p>
        </header>

        <Card className="overflow-hidden p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Список пуст.</p>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {rows.map((row, i) => {
                const emailQuery = row.email ?? (row.label.includes("@") ? row.label : "");
                const userHref = row.userId ? `/admin/users/${row.userId}` : `/admin/users${emailQuery ? `?email=${encodeURIComponent(emailQuery)}` : ""}`;
                const storageHref = row.userId && row.storageId ? `/admin/users/${row.userId}/storage/${row.storageId}` : null;

                return (
                  <li key={`${row.label}-${i}`} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{row.label}</p>
                      <p className="text-xs text-slate-500">{formatBytes(row.value)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={userHref}
                        className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-blue-500/50"
                      >
                        К пользователю
                      </Link>
                      <Link
                        href={emailQuery ? `/admin/users?email=${encodeURIComponent(emailQuery)}` : "/admin/users"}
                        className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-blue-500/50"
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
