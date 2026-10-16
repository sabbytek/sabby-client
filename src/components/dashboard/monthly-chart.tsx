"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatKobo } from "@/lib/format";

export type MonthlyPoint = { month: string; [series: string]: string | number | null };

export type ChartSeries = { key: string; label: string; color: string };

const compactNaira = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 });

/** Monthly line chart. Series values are kobo; null means "no data for that month". */
export function MonthlyChart({ data, series, height = 144 }: { data: MonthlyPoint[]; series: ChartSeries[]; height?: number }) {
  const hasData = data.some((p) => series.some((s) => typeof p[s.key] === "number" && p[s.key] !== 0));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ccc3d8" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#4a4455" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={hasData ? ["auto", "auto"] : [0, 1]}
            tick={{ fontSize: 11, fill: "#4a4455" }}
            tickFormatter={(v: number) => (hasData ? `₦${compactNaira.format(v / 100)}` : String(v))}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          {hasData && (
            <Tooltip
              formatter={(value, name) => [formatKobo(Number(value)), name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #ccc3d8" }}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeDasharray={hasData ? undefined : "4 4"}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
