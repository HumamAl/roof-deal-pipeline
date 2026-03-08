"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { DealImportDataPoint } from "@/lib/types";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-card p-3 text-xs shadow-md">
      <p className="font-semibold mb-1.5">{label} 2025–2026</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-mono font-medium text-foreground">
            {entry.value} deals
          </span>
        </p>
      ))}
    </div>
  );
};

export function DealImportChart({ data }: { data: DealImportDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="fillImported" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillEnriched" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillMeasured" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        <Area
          type="monotone"
          dataKey="dealsImported"
          name="Imported"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillImported)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="enriched"
          name="Enriched"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#fillEnriched)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="measured"
          name="Measured"
          stroke="var(--chart-4)"
          strokeWidth={2}
          fill="url(#fillMeasured)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
