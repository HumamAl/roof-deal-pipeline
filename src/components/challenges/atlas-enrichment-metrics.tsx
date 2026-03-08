"use client";

import { useEffect, useRef, useState } from "react";

interface Bar {
  label: string;
  beforeValue: number;
  afterValue: number;
  unit: string;
  status: "success" | "warning" | "destructive";
  beforeLabel: string;
  afterLabel: string;
}

const bars: Bar[] = [
  {
    label: "Homeowner lookup time",
    beforeValue: 180,
    afterValue: 4,
    unit: "s",
    status: "success",
    beforeLabel: "~3 min manual",
    afterLabel: "~4s automated",
  },
  {
    label: "OPA number accuracy",
    beforeValue: 88,
    afterValue: 99,
    unit: "%",
    status: "success",
    beforeLabel: "Manual search",
    afterLabel: "Direct API hit",
  },
  {
    label: "Daily enrichment capacity",
    beforeValue: 12,
    afterValue: 200,
    unit: " deals",
    status: "success",
    beforeLabel: "One employee",
    afterLabel: "Fully automated",
  },
  {
    label: "Missing mailing address rate",
    beforeValue: 14,
    afterValue: 2,
    unit: "%",
    status: "warning",
    beforeLabel: "Skipped when busy",
    afterLabel: "Fallback to OPA data",
  },
];

function AnimatedBar({ bar, triggered }: { bar: Bar; triggered: boolean }) {
  const afterPct = Math.min((bar.afterValue / Math.max(bar.beforeValue, bar.afterValue)) * 100, 100);
  const beforePct = Math.min((bar.beforeValue / Math.max(bar.beforeValue, bar.afterValue)) * 100, 100);

  const colorMap: Record<"success" | "warning" | "destructive", string> = {
    success: "bg-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]",
    destructive: "bg-destructive",
  };
  const colorClass = colorMap[bar.status];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline gap-2">
        <span className="text-xs text-muted-foreground">{bar.label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted-foreground line-through font-mono">
            {bar.beforeValue}{bar.unit}
          </span>
          <span className="text-xs font-semibold text-[color:var(--success)] font-mono">
            {bar.afterValue}{bar.unit}
          </span>
        </div>
      </div>
      {/* Before bar (ghost) */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-border/60"
          style={{
            width: triggered ? `${beforePct}%` : "0%",
            transition: "width 600ms ease-out",
          }}
        />
        <div
          className={["absolute inset-y-0 left-0 rounded-full", colorClass].join(" ")}
          style={{
            width: triggered ? `${afterPct}%` : "0%",
            transition: "width 900ms ease-out 200ms",
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[10px] text-muted-foreground">{bar.beforeLabel}</span>
        <span className="text-[10px] text-[color:var(--success)]">{bar.afterLabel}</span>
      </div>
    </div>
  );
}

export function AtlasEnrichmentMetrics() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setTriggered(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      {bars.map((bar) => (
        <AnimatedBar key={bar.label} bar={bar} triggered={triggered} />
      ))}
      <p className="text-[10px] text-muted-foreground pt-1">
        Green bar = automated result. Gray bar = current manual baseline. Bars animate on scroll.
      </p>
    </div>
  );
}
