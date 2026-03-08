"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { StageBreakdownDataPoint } from "@/lib/types";

const STAGE_COLORS: Record<string, string> = {
  "Pending Import": "var(--chart-5)",
  Enriching: "var(--chart-4)",
  "Measurement Pending": "var(--chart-3)",
  "Ready for Invoice": "var(--chart-1)",
  "Photo Processed": "var(--chart-2)",
  Invoiced: "var(--success)",
  Lost: "var(--destructive)",
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value?: number | string; payload?: { stage?: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded border border-border bg-card p-3 text-xs shadow-md">
      <p className="font-semibold mb-1">{d.payload?.stage}</p>
      <p className="text-muted-foreground font-mono">
        {d.value} deal{Number(d.value) !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export function StageBreakdownChart({
  data,
}: {
  data: StageBreakdownDataPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, bottom: 0, left: -8 }}
        barSize={28}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={48}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Deals" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.stage}
              fill={STAGE_COLORS[entry.stage] ?? "var(--chart-1)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
