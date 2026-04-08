"use client";

import { useMemo } from "react";
import { Card } from "@/shared/ui/card";
import { AdminStatistics } from "@/shared/types/admin";
import { normalizeStatRows } from "@/shared/lib/normalize-stat-row";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = { stats: AdminStatistics };

const DEMO = [
  { label: "Mon", value: 40 },
  { label: "Tue", value: 62 },
  { label: "Wed", value: 55 },
  { label: "Thu", value: 71 },
  { label: "Fri", value: 48 },
];

export function StatsChart({ stats }: Props) {
  const data = useMemo(() => {
    const fromApi = normalizeStatRows(stats.uploadLeaders as unknown[]);
    return fromApi.length > 0 ? fromApi : DEMO;
  }, [stats.uploadLeaders]);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-white">Upload activity</p>
          <p className="text-xs text-slate-500">Лидеры загрузок за период (или демо-данные, если API пустой)</p>
        </div>
      </div>
      <div className="h-72 w-full min-h-[288px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={288}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={([, dataMax]) => [0, Math.max(Number(dataMax) * 1.15 || 0, 1)]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Area type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} fill="url(#uploadGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
