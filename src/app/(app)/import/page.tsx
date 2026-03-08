"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importBatches, properties } from "@/data/mock-data";
import type { ImportBatch, ImportBatchStatus, Property } from "@/lib/types";
import {
  Download,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Building2,
  MapPin,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Status badge ─────────────────────────────────────────────────────────────

function BatchStatusBadge({ status }: { status: ImportBatchStatus }) {
  const config: Record<
    ImportBatchStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    completed: {
      label: "Completed",
      className:
        "bg-success/10 text-success border-success/30 font-mono text-[10px]",
      icon: <CheckCircle2 className="w-2.5 h-2.5" />,
    },
    partial: {
      label: "Partial",
      className:
        "bg-warning/10 text-warning-foreground border-warning/30 font-mono text-[10px]",
      icon: <AlertTriangle className="w-2.5 h-2.5" />,
    },
    in_progress: {
      label: "In Progress",
      className:
        "bg-primary/10 text-primary border-primary/25 font-mono text-[10px]",
      icon: <Clock className="w-2.5 h-2.5" />,
    },
    failed: {
      label: "Failed",
      className:
        "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
      icon: <XCircle className="w-2.5 h-2.5" />,
    },
  };

  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("px-1.5 py-0 inline-flex items-center gap-1", c.className)}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ── Property type badge ───────────────────────────────────────────────────────

function PropertyTypeBadge({ type }: { type: Property["propertyType"] }) {
  const labels: Record<Property["propertyType"], string> = {
    residential: "Residential",
    commercial: "Commercial",
    mixed_use: "Mixed Use",
    vacant_lot: "Vacant Lot",
  };
  const classes: Record<Property["propertyType"], string> = {
    residential:
      "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    commercial:
      "bg-accent/10 text-accent-foreground border-accent/25 font-mono text-[10px]",
    mixed_use:
      "bg-warning/10 text-warning-foreground border-warning/25 font-mono text-[10px]",
    vacant_lot:
      "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
  };
  return (
    <Badge variant="outline" className={cn("px-1.5 py-0", classes[type])}>
      {labels[type]}
    </Badge>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBatchTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Pipeline diagram ─────────────────────────────────────────────────────────

function MorningPipelineDiagram() {
  const steps = [
    {
      icon: Mail,
      label: "Portal Email",
      sublabel: "6:00 AM scrape",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Download,
      label: "Parse Referrals",
      sublabel: "Extract addresses",
      color: "text-accent-foreground",
      bg: "bg-accent/10",
    },
    {
      icon: Building2,
      label: "Deduplicate",
      sublabel: "OPA number check",
      color: "text-warning-foreground",
      bg: "bg-warning/10",
    },
    {
      icon: Zap,
      label: "Create Deals",
      sublabel: "Enter pipeline",
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="aesthetic-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">
          6:00 AM Morning Import Pipeline
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Automated email scrape — insurance portal referrals ingested daily at 6 AM
        </p>
      </div>

      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center shrink-0">
              <div className="flex flex-col items-center gap-2 px-4 py-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", step.bg)}>
                  <Icon className={cn("w-4 h-4", step.color)} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">{step.sublabel}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center shrink-0">
                  <div className="w-8 h-px bg-border" />
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Batches</p>
          <p className="text-xl font-bold font-mono text-primary">{importBatches.length}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Properties Scraped</p>
          <p className="text-xl font-bold font-mono text-primary">
            {importBatches.reduce((s, b) => s + b.propertyCount, 0)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Parse Failures</p>
          <p className="text-xl font-bold font-mono text-warning">
            {importBatches.reduce((s, b) => s + b.failedCount, 0)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Success Rate</p>
          <p className="text-xl font-bold font-mono text-success">
            {(
              ((importBatches.reduce((s, b) => s + b.propertyCount, 0) -
                importBatches.reduce((s, b) => s + b.failedCount, 0)) /
                importBatches.reduce((s, b) => s + b.propertyCount, 0)) *
              100
            ).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PropertyImportPage() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    importBatches[0].id
  );
  const [statusFilter, setStatusFilter] = useState<ImportBatchStatus | "all">("all");
  const [propSearch, setPropSearch] = useState("");
  const [propTypeFilter, setPropTypeFilter] = useState<Property["propertyType"] | "all">("all");

  const filteredBatches = useMemo(() => {
    if (statusFilter === "all") return importBatches;
    return importBatches.filter((b) => b.status === statusFilter);
  }, [statusFilter]);

  const selectedBatch = useMemo(
    () => importBatches.find((b) => b.id === selectedBatchId) ?? importBatches[0],
    [selectedBatchId]
  );

  const batchProperties = useMemo(() => {
    return properties.filter((p) => p.batchId === selectedBatch.id);
  }, [selectedBatch]);

  const displayedProperties = useMemo(() => {
    return batchProperties.filter((p) => {
      const matchType = propTypeFilter === "all" || p.propertyType === propTypeFilter;
      const q = propSearch.toLowerCase();
      const matchSearch =
        !q ||
        p.streetAddress.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        (p.opaNumber?.includes(q) ?? false);
      return matchType && matchSearch;
    });
  }, [batchProperties, propTypeFilter, propSearch]);

  return (
    <div className="p-[var(--content-padding)] space-y-5">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ letterSpacing: "var(--heading-tracking)" }}>
            Property Import
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Daily morning portal scrape · {importBatches.length} batches · {importBatches.reduce((s, b) => s + b.propertyCount, 0)} properties total
          </p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">
          <Download className="w-3 h-3 mr-1.5" />
          Export CSV
        </Button>
      </div>

      {/* ── Pipeline diagram ─────────────────────────────────────── */}
      <MorningPipelineDiagram />

      {/* ── Batch list + property detail ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[var(--grid-gap)]">
        {/* Batch selector */}
        <div className="lg:col-span-2 aesthetic-card overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Import Batches</h3>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ImportBatchStatus | "all")}
              >
                <SelectTrigger className="h-6 text-[11px] w-28">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {filteredBatches.length} batch{filteredBatches.length !== 1 ? "es" : ""} · click to inspect properties
            </p>
          </div>

          <div className="divide-y divide-border/40 max-h-[420px] overflow-y-auto">
            {filteredBatches.length === 0 && (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No batches match this filter.
              </div>
            )}
            {filteredBatches.map((batch) => {
              const isSelected = batch.id === selectedBatchId;
              const successCount = batch.propertyCount - batch.failedCount;
              return (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors duration-100",
                    isSelected
                      ? "bg-primary/8 border-l-[3px] border-l-primary"
                      : "hover:bg-[color:var(--surface-hover)] border-l-[3px] border-l-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold font-mono", isSelected ? "text-primary" : "text-foreground")}>
                        {batch.id}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatBatchTime(batch.importedAt)}
                      </p>
                    </div>
                    <BatchStatusBadge status={batch.status} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 truncate leading-relaxed">
                    {batch.sourceEmail.split("—")[0].trim()}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{successCount}</span> parsed
                    </span>
                    {batch.failedCount > 0 && (
                      <span className="text-[10px] text-warning flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {batch.failedCount} failed
                      </span>
                    )}
                  </div>
                  {batch.note && (
                    <p className="text-[10px] text-warning-foreground mt-1.5 bg-warning/8 rounded px-1.5 py-0.5">
                      {batch.note}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property table for selected batch */}
        <div className="lg:col-span-3 aesthetic-card overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border/60">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-sm font-semibold">
                  {selectedBatch.id} — Properties
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {displayedProperties.length} of {batchProperties.length} properties
                </p>
              </div>
              <BatchStatusBadge status={selectedBatch.status} />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  placeholder="Search address, OPA…"
                  className="pl-7 h-6 text-[11px]"
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                />
              </div>
              <Select
                value={propTypeFilter}
                onValueChange={(v) => setPropTypeFilter(v as Property["propertyType"] | "all")}
              >
                <SelectTrigger className="h-6 text-[11px] w-30">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed_use">Mixed Use</SelectItem>
                  <SelectItem value="vacant_lot">Vacant Lot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent sticky top-0 bg-card z-10">
                  <TableHead className="text-xs pl-4 text-muted-foreground uppercase tracking-wide">Address</TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">Neighborhood</TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wide pr-4">OPA #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProperties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-xs text-muted-foreground">
                      No properties match this filter.
                    </TableCell>
                  </TableRow>
                )}
                {displayedProperties.map((prop, idx) => (
                  <TableRow
                    key={prop.id}
                    className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100 animate-fade-up-in"
                    style={{ animationDelay: `${idx * 40}ms`, animationDuration: "120ms", animationFillMode: "both" }}
                  >
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium">{prop.streetAddress}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{prop.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-muted-foreground/60 shrink-0" />
                        <span className="text-xs text-muted-foreground">{prop.neighborhood}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PropertyTypeBadge type={prop.propertyType} />
                    </TableCell>
                    <TableCell className="pr-4">
                      {prop.opaNumber ? (
                        <span className="font-mono text-[11px] text-foreground border-l-2 border-l-success/60 pl-1.5">
                          {prop.opaNumber}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/50 italic">
                          Pending lookup
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Batch source email detail */}
          <div className="px-4 py-3 border-t border-border/40 bg-muted/30">
            <div className="flex items-start gap-2">
              <Mail className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Source Email</p>
                <p className="text-[11px] text-foreground/80">{selectedBatch.sourceEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
