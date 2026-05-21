import Link from "next/link";
import { SuspiciousTrafficEntry } from "@/shared/types/admin";
import { Card } from "@/shared/ui/card";

type Props = { rows: SuspiciousTrafficEntry[] };

function ScoreBadge({ score }: { score: number }) {
  const level =
    score >= 50
      ? { label: "Высокий", cls: "bg-rose-500/15 text-rose-600 ring-rose-500/30 dark:text-rose-300" }
      : score >= 20
        ? { label: "Средний", cls: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-300" }
        : { label: "Низкий", cls: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${level.cls}`}>
      <span className="font-mono text-sm">{score}</span>
      {level.label}
    </span>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  const labels: Record<string, string> = {
    path_enumeration: "Перебор путей",
    high_request_rate: "Высокий RPS",
    auth_errors: "Ошибки аутентификации",
    forbidden_access: "Запрещённый доступ",
    multi_ip: "Множество IP",
    multi_agent: "Множество UA",
  };
  return (
    <span className="rounded-md bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300 dark:bg-slate-800 dark:text-slate-300 light:bg-slate-200 light:text-slate-700">
      {labels[signal] ?? signal}
    </span>
  );
}

export function SuspiciousTrafficList({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-muted">Подозрительного трафика не обнаружено.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <Card key={row.userId} className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{row.email}</p>
              <p className="text-xs text-muted">ID пользователя: {row.userId}</p>
            </div>
            <div className="flex items-center gap-2">
              <ScoreBadge score={row.suspiciousScore} />
              <Link
                href={`/admin/users/${row.userId}`}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/50"
              >
                Профиль →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Запросов", value: row.requests },
              { label: "Ошибок авт.", value: row.authErrors },
              { label: "Запрещено", value: row.forbiddens },
              { label: "Уник. IP", value: row.uniqueIps },
              { label: "Уник. UA", value: row.uniqueAgents },
              { label: "Пик RPM", value: row.peakRequestsPerMinute },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-surface/50 px-3 py-2">
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {row.signals.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Сигналы:</span>
              {row.signals.map((s) => (
                <SignalBadge key={s} signal={s} />
              ))}
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
