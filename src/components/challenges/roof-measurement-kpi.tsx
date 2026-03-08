"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingDown, Calculator } from "lucide-react";

const kpis = [
  {
    label: "Time to calculate replacement cost",
    before: { value: "8–12 min", raw: 10, unit: "min" },
    after: { value: "~5 sec", raw: 0.08, unit: "min" },
    improvement: "99% faster",
  },
  {
    label: "Steps to complete measurement",
    before: { value: "6 manual steps", raw: 6, unit: "" },
    after: { value: "1 API call", raw: 1, unit: "" },
    improvement: "83% fewer steps",
  },
];

const formula = {
  sqft: 2340,
  rate: 6.33,
  get cost() { return Math.round(this.sqft * this.rate); },
};

export function RoofMeasurementKPI() {
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate the replacement cost counter
  useEffect(() => {
    if (!revealed) return;
    const target = formula.cost;
    const duration = 1200;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [revealed]);

  return (
    <div ref={ref} className="space-y-4">
      {/* KPI comparison grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-lg font-bold text-muted-foreground/60 line-through font-mono leading-tight">
                  {kpi.before.value}
                </p>
                <p className="text-[10px] text-muted-foreground">Current</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 mb-4 shrink-0" />
              <div>
                <p className="text-lg font-bold text-[color:var(--success)] font-mono leading-tight">
                  {kpi.after.value}
                </p>
                <p className="text-[10px] text-[color:var(--success)]">Automated</p>
              </div>
            </div>
            <div
              className="text-[10px] font-medium px-2 py-0.5 rounded w-fit font-mono"
              style={{
                backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
                color: "var(--success)",
              }}
            >
              {kpi.improvement}
            </div>
          </div>
        ))}
      </div>

      {/* Live calculation demo */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
            Example: 1847 N Broad St — auto-calculated
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
          <span className="text-muted-foreground">{formula.sqft.toLocaleString()} sqft</span>
          <span className="text-muted-foreground/50">×</span>
          <span className="text-muted-foreground">$6.33/sqft</span>
          <span className="text-muted-foreground/50">=</span>
          <span className="text-lg font-bold text-primary">
            ${revealed ? count.toLocaleString() : "0"}
          </span>
          <span className="text-[10px] text-muted-foreground">replacement cost</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-3 h-3 text-[color:var(--success)]" />
          <p className="text-[10px] text-muted-foreground">
            Written to Pipedrive Deal and invoice template automatically. No manual multiplication.
          </p>
        </div>
      </div>
    </div>
  );
}
