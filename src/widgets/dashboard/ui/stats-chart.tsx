"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/app/providers/theme-provider";
import { Card } from "@/shared/ui/card";
import { AdminStatistics } from "@/shared/types/admin";
import { normalizeStatRows } from "@/shared/lib/normalize-stat-row";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

type Props = { stats: AdminStatistics };

const DEMO = [
  { label: "Mon", value: 40 },
  { label: "Tue", value: 62 },
  { label: "Wed", value: 55 },
  { label: "Thu", value: 71 },
  { label: "Fri", value: 48 },
];

const CHART_HEIGHT = 288;

function useChartWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function StatsChart({ stats }: Props) {
  const { theme } = useTheme();
  const { ref, width } = useChartWidth();
  const isDark = theme === "dark";
  const tick = isDark ? "#94a3b8" : "#64748b";
  const grid = isDark ? "#1e293b" : "#e2e8f0";
  const axis = isDark ? "#334155" : "#cbd5e1";

  const data = useMemo(() => {
    const fromApi = normalizeStatRows(stats.uploadLeaders as unknown[]);
    return fromApi.length > 0 ? fromApi : DEMO;
  }, [stats.uploadLeaders]);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-foreground">Upload activity</p>
          <p className="text-xs text-muted">Лидеры загрузок за период (или демо-данные, если API пустой)</p>
        </div>
      </div>
      <div ref={ref} className="h-72 w-full min-h-[288px] min-w-0">
        {width > 0 ? (
          <AreaChart width={width} height={CHART_HEIGHT} data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: tick, fontSize: 11 }} tickLine={false} axisLine={{ stroke: axis }} />
            <YAxis
              tick={{ fill: tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={([, dataMax]) => [0, Math.max(Number(dataMax) * 1.15 || 0, 1)]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                border: `1px solid ${axis}`,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
            />
            <Area type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} fill="url(#uploadGradient)" />
          </AreaChart>
        ) : null}
      </div>
    </Card>
  );
}
