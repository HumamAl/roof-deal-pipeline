"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DemoBanner } from "@/components/layout/conversion-elements";
import {
  deals,
  dashboardStats,
  pipelineStageSummary,
  dealImportTrend,
  stageBreakdown,
} from "@/data/mock-data";
import type { Deal, PipelineStage } from "@/lib/types";
import {
  Download,
  Database,
  Ruler,
  Camera,
  ArrowRight,
  ChevronRight,
  Zap,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── SSR-safe chart imports ───────────────────────────────────────────────────

const DealImportChart = dynamic(
  () =>
    import("@/components/dashboard/deal-import-chart").then(
      (m) => m.DealImportChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

const StageBreakdownChart = dynamic(
  () =>
    import("@/components/dashboard/stage-breakdown-chart").then(
      (m) => m.StageBreakdownChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

// ── Animated counter hook (Intersection Observer) ────────────────────────────

function useCountUp(target: number, duration = 1100) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Stage config ─────────────────────────────────────────────────────────────

type FilterStage = "all" | PipelineStage;

const PIPELINE_STAGES = [
  {
    key: "pending_import" as PipelineStage,
    label: "Imported",
    icon: Download,
    stepNumber: 1,
  },
  {
    key: "enriching" as PipelineStage,
    label: "Enriched",
    icon: Database,
    stepNumber: 2,
  },
  {
    key: "measurement_pending" as PipelineStage,
    label: "Measured",
    icon: Ruler,
    stepNumber: 3,
  },
  {
    key: "ready_for_invoice" as PipelineStage,
    label: "Extracted",
    icon: Camera,
    stepNumber: 4,
  },
];

// Map stages to display badges
function stageBadge(stage: PipelineStage) {
  const variants: Record<
    PipelineStage,
    { label: string; className: string }
  > = {
    pending_import: {
      label: "Pending Import",
      className:
        "bg-warning/15 text-warning-foreground border-warning/30 font-mono text-[10px]",
    },
    enriching: {
      label: "Enriching",
      className:
        "bg-primary/10 text-primary border-primary/25 font-mono text-[10px]",
    },
    measurement_pending: {
      label: "Measuring",
      className:
        "bg-accent/10 text-accent-foreground border-accent/25 font-mono text-[10px]",
    },
    ready_for_invoice: {
      label: "Ready",
      className:
        "bg-success/15 text-success-foreground border-success/30 font-mono text-[10px]",
    },
    photo_processed: {
      label: "Photo Done",
      className:
        "bg-success/15 text-success-foreground border-success/30 font-mono text-[10px]",
    },
    invoiced: {
      label: "Invoiced",
      className:
        "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    },
    lost: {
      label: "Lost",
      className:
        "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
    },
  };
  const v = variants[stage];
  return (
    <Badge variant="outline" className={cn("px-1.5 py-0", v.className)}>
      {v.label}
    </Badge>
  );
}

function stepBadge(step: number) {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono shrink-0">
      {step}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  format: "integer" | "currency" | "percent" | "sqft";
  change: number;
  context: string;
  index: number;
  isEnriched?: boolean;
}

function StatCard({
  title,
  value,
  format,
  change,
  context,
  index,
  isEnriched,
}: StatCardProps) {
  const { count, ref } = useCountUp(Math.round(value));

  function fmt(n: number) {
    if (format === "currency") {
      return "$" + n.toLocaleString("en-US");
    }
    if (format === "percent") {
      return n.toFixed(1) + "%";
    }
    if (format === "sqft") {
      return n.toLocaleString("en-US") + " sq";
    }
    return n.toLocaleString("en-US");
  }

  const isPositive = change >= 0;

  return (
    <div
      ref={ref}
      className={cn(
        "aesthetic-card p-5 flex flex-col gap-3 animate-fade-up-in",
        isEnriched && "border-l-[3px] border-l-success/60"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        {isEnriched && (
          <span title="Auto-enriched">
            <Zap className="w-3.5 h-3.5 text-success shrink-0" />
          </span>
        )}
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums text-primary leading-none">
        {fmt(count)}
      </p>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-success shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive shrink-0" />
        )}
        <span
          className={isPositive ? "text-success font-medium" : "text-destructive font-medium"}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">&middot; {context}</span>
      </p>
    </div>
  );
}

// ── Pipeline Health Bar ───────────────────────────────────────────────────────

function PipelineHealthBar({
  activeStage,
  onStageClick,
}: {
  activeStage: FilterStage;
  onStageClick: (stage: FilterStage) => void;
}) {
  const total = pipelineStageSummary.reduce((s, st) => s + st.count, 0);

  return (
    <div className="aesthetic-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Morning Run Pipeline
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            4-step automation · {total} active deals · click stage to filter
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={() => onStageClick("all")}
        >
          View All
        </Button>
      </div>

      {/* Assembly line bar */}
      <div className="flex items-stretch gap-0">
        {PIPELINE_STAGES.map((ps, i) => {
          const summary = pipelineStageSummary.find(
            (s) => s.stage === ps.key
          );
          const count = summary?.count ?? 0;
          const isActive = activeStage === ps.key;
          const Icon = ps.icon;

          return (
            <div key={ps.key} className="flex items-center flex-1 min-w-0">
              {/* Stage block */}
              <button
                onClick={() =>
                  onStageClick(isActive ? "all" : ps.key)
                }
                className={cn(
                  "flex-1 min-w-0 flex flex-col items-center gap-2 py-4 px-3 rounded transition-all duration-100 border",
                  isActive
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-card border-border/60 hover:bg-muted/60 hover:border-border"
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-100",
                    isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="text-center min-w-0">
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Step {ps.stepNumber}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold font-mono tabular-nums leading-tight",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {count}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                    {ps.label}
                  </p>
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isActive ? "bg-primary" : "bg-border"
                    )}
                    style={{ width: `${Math.min((count / 8) * 100, 100)}%` }}
                  />
                </div>
              </button>

              {/* Arrow connector */}
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="flex-none px-1">
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-colors duration-100",
                      isActive ? "text-primary" : "text-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel summary line */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1 text-xs text-muted-foreground font-mono flex-wrap">
        {pipelineStageSummary.map((s, i) => (
          <span key={s.stage} className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{s.count}</span>
            <span>{s.label.toLowerCase()}</span>
            {i < pipelineStageSummary.length - 1 && (
              <ArrowRight className="w-3 h-3 text-border mx-0.5" />
            )}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {(
            (pipelineStageSummary[3].count /
              pipelineStageSummary[0].count) *
            100
          ).toFixed(0)}
          % throughput
        </span>
      </div>
    </div>
  );
}

// ── Deal row helpers ──────────────────────────────────────────────────────────

function formatCost(n: number | null | undefined) {
  if (n == null) return <span className="text-muted-foreground/50">—</span>;
  return (
    <span className="font-mono text-xs">
      ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}
    </span>
  );
}

function formatSqft(n: number | null | undefined) {
  if (n == null) return <span className="text-muted-foreground/50">—</span>;
  return (
    <span className="font-mono text-xs">{n.toLocaleString("en-US")} sq</span>
  );
}

function daysInStage(deal: Deal): number {
  const now = new Date("2026-03-07");
  const ref =
    deal.invoicedAt ??
    deal.photoProcessedAt ??
    deal.measuredAt ??
    deal.enrichedAt ??
    deal.importedAt;
  return Math.floor(
    (now.getTime() - new Date(ref).getTime()) / (1000 * 60 * 60 * 24)
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PipelineOperationsPage() {
  const [activeStage, setActiveStage] = useState<FilterStage>("all");
  const [search, setSearch] = useState("");

  const filteredDeals = useMemo(() => {
    let list = deals;
    if (activeStage !== "all") {
      list = list.filter((d) => d.stage === activeStage);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.streetAddress.toLowerCase().includes(q) ||
          (d.ownerName?.toLowerCase().includes(q) ?? false) ||
          d.neighborhood.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeStage, search]);

  const stats = dashboardStats;

  return (
    <div
      className="p-[var(--content-padding)] space-y-5"
      style={{ minHeight: "100%" }}
    >
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div>
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ letterSpacing: "var(--heading-tracking)" }}
        >
          Pipeline Operations
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Today&apos;s morning run &middot; March 7, 2026 &middot;{" "}
          {stats.dealsImportedToday} new deals imported
        </p>
      </div>

      {/* ── 1. Pipeline Health Bar (HERO) ────────────────────────── */}
      <PipelineHealthBar
        activeStage={activeStage}
        onStageClick={setActiveStage}
      />

      {/* ── 2. Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap)]">
        <StatCard
          title="Deals Imported Today"
          value={stats.dealsImportedToday}
          format="integer"
          change={stats.dealsImportedTodayChange}
          context="vs yesterday's batch"
          index={0}
        />
        <StatCard
          title="Enrichment Rate"
          value={stats.enrichmentCompletionRate}
          format="percent"
          change={stats.enrichmentRateChange}
          context="Atlas OPA success rate"
          index={1}
          isEnriched
        />
        <StatCard
          title="Avg Replacement Cost"
          value={stats.avgReplacementCost}
          format="currency"
          change={stats.avgReplacementCostChange}
          context="$6.33/sqft · YTD"
          index={2}
          isEnriched
        />
        <StatCard
          title="Ready for Invoice"
          value={stats.readyForInvoice}
          format="integer"
          change={8.3}
          context={`${stats.readyForInvoice} deals cleared extraction`}
          index={3}
        />
      </div>

      {/* ── 3. Charts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--grid-gap)]">
        {/* Deal import trend */}
        <div className="aesthetic-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Deal Import Volume</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Oct 2025 – Mar 2026 · Nov 14 hailstorm surge visible
            </p>
          </div>
          <DealImportChart data={dealImportTrend} />
        </div>

        {/* Stage breakdown */}
        <div className="aesthetic-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Deals by Pipeline Stage</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current distribution across all 7 stages
            </p>
          </div>
          <StageBreakdownChart data={stageBreakdown} />
        </div>
      </div>

      {/* ── 4. Recent Deals Table ─────────────────────────────────── */}
      <div className="aesthetic-card overflow-hidden">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 pt-4 pb-3 border-b border-border/60">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Recent Deals</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredDeals.length} deal
              {filteredDeals.length !== 1 ? "s" : ""}
              {activeStage !== "all" ? ` · filtered by stage` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search address, owner…"
                className="pl-8 h-7 text-xs w-52"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {activeStage !== "all" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setActiveStage("all")}
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>

        {/* Stage filter chips */}
        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-border/40 overflow-x-auto">
          {(
            [
              { key: "all" as const, label: "All Deals" },
              { key: "pending_import" as PipelineStage, label: "Pending Import" },
              { key: "enriching" as PipelineStage, label: "Enriching" },
              { key: "measurement_pending" as PipelineStage, label: "Measuring" },
              { key: "ready_for_invoice" as PipelineStage, label: "Ready" },
              { key: "invoiced" as PipelineStage, label: "Invoiced" },
              { key: "lost" as PipelineStage, label: "Lost" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveStage(opt.key as FilterStage)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap border transition-colors duration-100",
                activeStage === opt.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs w-8 pl-5">#</TableHead>
                <TableHead className="text-xs">Address</TableHead>
                <TableHead className="text-xs">Homeowner</TableHead>
                <TableHead className="text-xs">Stage</TableHead>
                <TableHead className="text-xs text-right">
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 text-success" /> Est. ($)
                  </span>
                </TableHead>
                <TableHead className="text-xs text-right">Roof Size</TableHead>
                <TableHead className="text-xs text-right pr-5">Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-sm text-muted-foreground py-10"
                  >
                    No deals match this filter.
                  </TableCell>
                </TableRow>
              )}
              {filteredDeals.slice(0, 12).map((deal) => {
                const days = daysInStage(deal);
                const isOverdue = days > 3;

                return (
                  <TableRow
                    key={deal.id}
                    className="hover:bg-muted/40 transition-colors duration-100"
                  >
                    {/* Step badge */}
                    <TableCell className="pl-5 w-8">
                      {stepBadge(deal.automationStep)}
                    </TableCell>

                    {/* Address */}
                    <TableCell className="max-w-[180px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium truncate">
                          {deal.streetAddress}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {deal.neighborhood} · {deal.zip}
                        </span>
                      </div>
                    </TableCell>

                    {/* Homeowner */}
                    <TableCell>
                      {deal.ownerName ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs truncate max-w-[140px] block">
                            {deal.ownerName
                              .split(" ")
                              .map(
                                (w) =>
                                  w.charAt(0) + w.slice(1).toLowerCase()
                              )
                              .join(" ")}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-success">
                            <Zap className="w-2.5 h-2.5" />
                            Atlas enriched
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Awaiting lookup
                        </span>
                      )}
                    </TableCell>

                    {/* Stage badge */}
                    <TableCell>{stageBadge(deal.stage)}</TableCell>

                    {/* Replacement cost with tooltip hint */}
                    <TableCell className="text-right">
                      <span
                        title={
                          deal.sqft
                            ? `${deal.sqft.toLocaleString()} sqft × $6.33`
                            : "Not yet measured"
                        }
                      >
                        {deal.replacementCost ? (
                          <span className="font-mono text-xs font-medium text-foreground">
                            {formatCost(deal.replacementCost)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">
                            —
                          </span>
                        )}
                      </span>
                    </TableCell>

                    {/* Roof size */}
                    <TableCell className="text-right">
                      {formatSqft(deal.sqft)}
                    </TableCell>

                    {/* Days in stage */}
                    <TableCell className="text-right pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-mono",
                          isOverdue
                            ? "text-warning"
                            : "text-muted-foreground"
                        )}
                      >
                        {isOverdue && (
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                        )}
                        {!isOverdue && deal.stage === "invoiced" && (
                          <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                        )}
                        {days}d
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Rush deals callout */}
        {filteredDeals.some((d) => d.isRush) && (
          <div className="px-5 py-3 border-t border-warning/20 bg-warning/5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
            <p className="text-xs text-warning-foreground">
              <span className="font-semibold">
                {filteredDeals.filter((d) => d.isRush).length} rush deal
                {filteredDeals.filter((d) => d.isRush).length !== 1 ? "s" : ""}
              </span>{" "}
              in current view — adjuster inspection deadlines are approaching.
            </p>
          </div>
        )}
      </div>

      {/* ── 5. Conversion Banner ──────────────────────────────────── */}
      <DemoBanner />
    </div>
  );
}
