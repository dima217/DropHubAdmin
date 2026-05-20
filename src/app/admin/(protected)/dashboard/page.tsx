import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { FadeIn } from "@/shared/ui/fade-in";
import { StatsChart } from "@/widgets/dashboard/ui/stats-chart";
import { StatsOverview } from "@/widgets/dashboard/ui/stats-overview";

const emptyStats = {
  periodDays: 30,
  generatedAt: new Date().toISOString(),
  storageUsageTop: [],
  uploadLeaders: [],
  suspiciousTraffic: [],
  mostLoadedFolders: [],
  inactiveAccounts: [],
};

export default async function DashboardPage() {
  const token = await requireAdminToken();
  const stats = await adminApi.getStatistics(token).catch(() => emptyStats);

  return (
    <FadeIn>
      <section className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Сводка по API statistics.</p>
        </header>
        <StatsOverview stats={stats} />
        <StatsChart stats={stats} />
      </section>
    </FadeIn>
  );
}
