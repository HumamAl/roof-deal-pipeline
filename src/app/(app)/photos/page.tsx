"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { photoExtractions } from "@/data/mock-data";
import type { PhotoExtraction, PhotoExtractionStatus } from "@/lib/types";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PhotoExtractionStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  extracted: {
    label: "Extracted",
    className:
      "bg-success/10 text-success border-success/30 font-mono text-[10px]",
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
  },
  low_confidence: {
    label: "Low Confidence",
    className:
      "bg-warning/10 text-warning-foreground border-warning/30 font-mono text-[10px]",
    icon: <AlertTriangle className="w-2.5 h-2.5" />,
  },
  failed: {
    label: "Failed",
    className:
      "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
    icon: <XCircle className="w-2.5 h-2.5" />,
  },
  manually_corrected: {
    label: "Corrected",
    className:
      "bg-primary/10 text-primary border-primary/25 font-mono text-[10px]",
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
  },
  queued: {
    label: "Queued",
    className:
      "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    icon: <Clock className="w-2.5 h-2.5" />,
  },
  processing: {
    label: "Processing",
    className:
      "bg-primary/10 text-primary border-primary/25 font-mono text-[10px]",
    icon: <Clock className="w-2.5 h-2.5" />,
  },
};

function ExtractionStatusBadge({ status }: { status: PhotoExtractionStatus }) {
  const c = STATUS_CONFIG[status];
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

// ── Confidence indicator ──────────────────────────────────────────────────────

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.85
      ? "bg-success"
      : score >= 0.70
      ? "bg-warning"
      : "bg-destructive";
  const textColor =
    score >= 0.85
      ? "text-success"
      : score >= 0.70
      ? "text-warning"
      : "text-destructive";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn("font-mono text-[11px] tabular-nums font-semibold", textColor)}>
        {pct}%
      </span>
    </div>
  );
}

// ── Extracted field display ───────────────────────────────────────────────────

function FieldValue({ value }: { value: string | number | null | undefined }) {
  if (value == null) {
    return <span className="text-muted-foreground/40 italic text-[10px]">not found</span>;
  }
  if (typeof value === "number") {
    const formatted = "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (
      <span className="font-mono text-[11px] text-foreground border-l-2 border-l-success/60 pl-1.5">
        {formatted}
      </span>
    );
  }
  return <span className="text-[11px] text-foreground">{value}</span>;
}

// ── Summary header cards ──────────────────────────────────────────────────────

function SummaryCards({ extractions }: { extractions: PhotoExtraction[] }) {
  const all = photoExtractions;
  const extracted = all.filter((e) => e.status === "extracted" || e.status === "manually_corrected").length;
  const needsReview = all.filter((e) => e.status === "low_confidence").length;
  const failed = all.filter((e) => e.status === "failed").length;
  const avgConf =
    all.length > 0
      ? all.reduce((s, e) => s + e.confidenceScore, 0) / all.length
      : 0;

  const cards = [
    {
      label: "Successfully Extracted",
      value: extracted.toString(),
      sub: `of ${all.length} documents processed`,
      enriched: true,
    },
    {
      label: "Avg Confidence Score",
      value: (avgConf * 100).toFixed(0) + "%",
      sub: "across all extractions",
      enriched: false,
    },
    {
      label: "Needs Review",
      value: needsReview.toString(),
      sub: "confidence below threshold",
      alert: needsReview > 0,
    },
    {
      label: "Failed Extractions",
      value: failed.toString(),
      sub: "OCR returned no usable fields",
      destructive: failed > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap)]">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={cn(
            "aesthetic-card p-4 animate-fade-up-in",
            card.enriched && "border-l-[3px] border-l-success/60",
            card.alert && "border-l-[3px] border-l-warning/60",
            card.destructive && "border-l-[3px] border-l-destructive/50"
          )}
          style={{
            animationDelay: `${i * 50}ms`,
            animationDuration: "150ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
            {card.label}
          </p>
          <p
            className={cn(
              "text-xl font-bold font-mono tabular-nums leading-tight",
              card.enriched ? "text-success" : card.alert ? "text-warning" : card.destructive ? "text-destructive" : "text-primary"
            )}
          >
            {card.value}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Extraction card ───────────────────────────────────────────────────────────

function ExtractionCard({
  extraction,
  index,
}: {
  extraction: PhotoExtraction;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const fields = extraction.extractedFields;
  const extractedCount = Object.values(fields).filter((v) => v != null).length;
  const totalCount = Object.values(fields).length;

  const fieldDefs = [
    { label: "Owner Name", value: fields.ownerName },
    { label: "Property Address", value: fields.propertyAddress },
    { label: "Claim Number", value: fields.claimNumber },
    { label: "Damage Date", value: fields.damageDate },
    { label: "Adjustor Name", value: fields.adjustorName },
    { label: "RCV Amount", value: fields.rcvAmount },
    { label: "ACV Amount", value: fields.acvAmount },
    { label: "Deductible", value: fields.deductible },
    { label: "Coverage Type", value: fields.coverageType },
  ];

  return (
    <div
      className="aesthetic-card overflow-hidden animate-fade-up-in"
      style={{
        animationDelay: `${index * 60}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      {/* Card header */}
      <button
        className="w-full text-left p-4 hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{extraction.photoFileName}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {extraction.id} &middot;{" "}
                {extraction.processedAt
                  ? new Date(extraction.processedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ExtractionStatusBadge status={extraction.status} />
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Confidence + field count bar */}
        <div className="flex items-center gap-4 mt-3">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Confidence</p>
            <ConfidenceBar score={extraction.confidenceScore} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Fields Extracted</p>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: totalCount }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-1.5 rounded-sm",
                      i < extractedCount ? "bg-success" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {extractedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        {extraction.reviewNote && !expanded && (
          <p className="text-[10px] text-warning-foreground mt-2 bg-warning/8 rounded px-2 py-1 text-left">
            {extraction.reviewNote}
          </p>
        )}
      </button>

      {/* Expanded extracted fields */}
      {expanded && (
        <div className="border-t border-border/60 px-4 py-4 bg-muted/20">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="w-3 h-3 text-success" />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              AI-Extracted Fields
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
            {fieldDefs.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <FieldValue value={value} />
              </div>
            ))}
          </div>
          {extraction.reviewNote && (
            <div className="mt-4 pt-3 border-t border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                Review Note
              </p>
              <p className="text-xs text-warning-foreground bg-warning/8 rounded px-2 py-1.5">
                {extraction.reviewNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PhotoExtractorPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PhotoExtractionStatus | "all"
  >("all");
  const [confFilter, setConfFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const displayed = useMemo(() => {
    let list = [...photoExtractions];

    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }

    if (confFilter === "high") {
      list = list.filter((e) => e.confidenceScore >= 0.85);
    } else if (confFilter === "medium") {
      list = list.filter(
        (e) => e.confidenceScore >= 0.70 && e.confidenceScore < 0.85
      );
    } else if (confFilter === "low") {
      list = list.filter((e) => e.confidenceScore < 0.70);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.photoFileName.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          (e.extractedFields.ownerName?.toLowerCase().includes(q) ?? false) ||
          (e.extractedFields.claimNumber?.toLowerCase().includes(q) ?? false)
      );
    }

    return list;
  }, [search, statusFilter, confFilter]);

  return (
    <div className="p-[var(--content-padding)] space-y-5">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ letterSpacing: "var(--heading-tracking)" }}
          >
            Photo Extractor
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            AI-extracted claim fields from adjuster reports and damage photos
          </p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">
          <Download className="w-3 h-3 mr-1.5" />
          Export
        </Button>
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      <SummaryCards extractions={displayed} />

      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search filename, claim number, owner…"
            className="pl-8 h-7 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as PhotoExtractionStatus | "all")
          }
        >
          <SelectTrigger className="h-7 text-xs w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="extracted">Extracted</SelectItem>
            <SelectItem value="low_confidence">Low Confidence</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="manually_corrected">Corrected</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
          </SelectContent>
        </Select>

        {/* Confidence filter chips */}
        <div className="flex items-center gap-1">
          {(
            [
              { key: "all" as const, label: "All Conf." },
              { key: "high" as const, label: "\u226585%" },
              { key: "medium" as const, label: "70–84%" },
              { key: "low" as const, label: "<70%" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setConfFilter(opt.key)}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-mono border transition-colors duration-100",
                confFilter === opt.key
                  ? opt.key === "high"
                    ? "bg-success/10 border-success/30 text-success"
                    : opt.key === "medium"
                    ? "bg-warning/10 border-warning/30 text-warning-foreground"
                    : opt.key === "low"
                    ? "bg-destructive/10 border-destructive/25 text-destructive"
                    : "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground shrink-0">
          {displayed.length} extraction{displayed.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Extraction cards ─────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="aesthetic-card p-10 text-center">
          <Camera className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No photo extractions match this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--grid-gap)]">
          {displayed.map((extraction, i) => (
            <ExtractionCard key={extraction.id} extraction={extraction} index={i} />
          ))}
        </div>
      )}

      {/* Failed callout */}
      {photoExtractions.some((e) => e.status === "failed") && (
        <div className="aesthetic-card px-4 py-3 border-destructive/20 bg-destructive/5 flex items-center gap-2">
          <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
          <p className="text-xs text-destructive">
            <span className="font-semibold">
              {photoExtractions.filter((e) => e.status === "failed").length}{" "}
              extraction
              {photoExtractions.filter((e) => e.status === "failed").length !== 1
                ? "s"
                : ""}{" "}
              failed
            </span>{" "}
            — homeowner must resend a clearer copy of the adjuster report.
          </p>
        </div>
      )}
    </div>
  );
}
