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
import { roofMeasurements, properties } from "@/data/mock-data";
import type {
  RoofMeasurement,
  RoofMaterial,
  RoofType,
  MeasurementSource,
  MeasurementStatus,
} from "@/lib/types";
import {
  Ruler,
  ChevronUp,
  ChevronDown,
  Search,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Satellite,
  Pencil,
  Camera,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Labels ────────────────────────────────────────────────────────────────────

const MATERIAL_LABELS: Record<RoofMaterial, string> = {
  asphalt_shingles: "Asphalt Shingles",
  metal: "Metal",
  tpo: "TPO",
  epdm: "EPDM",
  slate: "Slate",
  modified_bitumen: "Mod. Bitumen",
};

const ROOF_TYPE_LABELS: Record<RoofType, string> = {
  flat: "Flat",
  pitched_gable: "Pitched Gable",
  hip: "Hip",
  mansard: "Mansard",
  shed: "Shed",
};

const SOURCE_LABELS: Record<MeasurementSource, string> = {
  eagleview: "EagleView",
  manual_field: "Manual Field",
  satellite_estimate: "Satellite Est.",
  photo_extracted: "Photo Extracted",
};

// ── Status badge ─────────────────────────────────────────────────────────────

function MeasurementStatusBadge({ status }: { status: MeasurementStatus }) {
  const config: Record<
    MeasurementStatus,
    { label: string; className: string }
  > = {
    measured: {
      label: "Measured",
      className:
        "bg-success/10 text-success border-success/30 font-mono text-[10px]",
    },
    pending: {
      label: "Pending",
      className:
        "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    },
    needs_review: {
      label: "Needs Review",
      className:
        "bg-warning/10 text-warning-foreground border-warning/30 font-mono text-[10px]",
    },
    disputed: {
      label: "Disputed",
      className:
        "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
    },
  };

  const c = config[status];
  return (
    <Badge variant="outline" className={cn("px-1.5 py-0", c.className)}>
      {c.label}
    </Badge>
  );
}

// ── Source indicator ──────────────────────────────────────────────────────────

function SourceIcon({ source }: { source: MeasurementSource }) {
  const config: Record<
    MeasurementSource,
    { icon: React.ReactNode; color: string }
  > = {
    eagleview: { icon: <Eye className="w-3 h-3" />, color: "text-primary" },
    satellite_estimate: {
      icon: <Satellite className="w-3 h-3" />,
      color: "text-accent-foreground",
    },
    manual_field: {
      icon: <Pencil className="w-3 h-3" />,
      color: "text-warning-foreground",
    },
    photo_extracted: {
      icon: <Camera className="w-3 h-3" />,
      color: "text-muted-foreground",
    },
  };
  const { icon, color } = config[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-mono",
        color
      )}
    >
      {icon}
      {SOURCE_LABELS[source]}
    </span>
  );
}

// ── Summary stat cards ────────────────────────────────────────────────────────

function SummaryCards({ measurements }: { measurements: RoofMeasurement[] }) {
  const all = roofMeasurements;
  const totalSqft = all.reduce((s, m) => s + m.sqft, 0);
  const totalCost = all.reduce((s, m) => s + m.replacementCost, 0);
  const needsReview = all.filter(
    (m) => m.status === "needs_review" || m.status === "disputed"
  ).length;

  const cards = [
    {
      label: "Total Roof Area",
      value: totalSqft.toLocaleString("en-US") + " sqft",
      sub: `${(totalSqft / 100).toFixed(1)} squares total`,
      enriched: false,
    },
    {
      label: "Total Replacement Value",
      value: "$" + Math.round(totalCost).toLocaleString("en-US"),
      sub: "sqft \u00d7 $6.33 per property",
      enriched: true,
    },
    {
      label: "Avg Roof Size",
      value:
        all.length > 0
          ? Math.round(totalSqft / all.length).toLocaleString() + " sqft"
          : "—",
      sub: `across ${all.length} measurements`,
      enriched: false,
    },
    {
      label: "Needs Review",
      value: needsReview.toString(),
      sub:
        needsReview > 0 ? "disputed or flagged" : "all measurements clear",
      enriched: false,
      alert: needsReview > 0,
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
            card.alert && "border-l-[3px] border-l-warning/60"
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
          <p className="text-xl font-bold font-mono tabular-nums text-primary leading-tight">
            {card.value}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Sort helper ───────────────────────────────────────────────────────────────

type SortKey = "sqft" | "replacementCost" | "squares" | "measuredAt";
type SortDir = "asc" | "desc";

function SortableHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = currentKey === sortKey;
  return (
    <TableHead
      className={cn(
        "text-xs text-muted-foreground uppercase tracking-wide cursor-pointer select-none",
        active && "text-foreground"
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          currentDir === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <ChevronDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RoofMeasurementsPage() {
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState<RoofMaterial | "all">(
    "all"
  );
  const [roofTypeFilter, setRoofTypeFilter] = useState<RoofType | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<MeasurementStatus | "all">(
    "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>("replacementCost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const addressMap = useMemo(() => {
    const map: Record<string, string> = {};
    properties.forEach((p) => {
      map[p.id] = p.streetAddress;
    });
    return map;
  }, []);

  const displayed = useMemo(() => {
    let list = [...roofMeasurements];

    if (materialFilter !== "all") {
      list = list.filter((m) => m.material === materialFilter);
    }
    if (roofTypeFilter !== "all") {
      list = list.filter((m) => m.roofType === roofTypeFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((m) => m.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.id.toLowerCase().includes(q) ||
          (addressMap[m.propertyId] ?? "").toLowerCase().includes(q) ||
          MATERIAL_LABELS[m.material].toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === "sqft") {
        av = a.sqft;
        bv = b.sqft;
      } else if (sortKey === "replacementCost") {
        av = a.replacementCost;
        bv = b.replacementCost;
      } else if (sortKey === "squares") {
        av = a.squares;
        bv = b.squares;
      } else {
        av = a.measuredAt ?? "";
        bv = b.measuredAt ?? "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [
    search,
    materialFilter,
    roofTypeFilter,
    statusFilter,
    sortKey,
    sortDir,
    addressMap,
  ]);

  const disputedCount = roofMeasurements.filter(
    (m) => m.status === "disputed"
  ).length;

  return (
    <div className="p-[var(--content-padding)] space-y-5">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ letterSpacing: "var(--heading-tracking)" }}
          >
            Roof Measurements
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            EagleView + satellite data · cost formula: sqft &times; $6.33 =
            replacement value
          </p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">
          <Download className="w-3 h-3 mr-1.5" />
          Export
        </Button>
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      <SummaryCards measurements={displayed} />

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="aesthetic-card overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 pt-4 pb-3 border-b border-border/60 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search address, material…"
              className="pl-8 h-7 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={materialFilter}
            onValueChange={(v) =>
              setMaterialFilter(v as RoofMaterial | "all")
            }
          >
            <SelectTrigger className="h-7 text-xs w-40">
              <SelectValue placeholder="All Materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Materials</SelectItem>
              {Object.entries(MATERIAL_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={roofTypeFilter}
            onValueChange={(v) => setRoofTypeFilter(v as RoofType | "all")}
          >
            <SelectTrigger className="h-7 text-xs w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roof Types</SelectItem>
              {Object.entries(ROOF_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as MeasurementStatus | "all")
            }
          >
            <SelectTrigger className="h-7 text-xs w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="measured">Measured</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground shrink-0">
            {displayed.length} measurement{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide pl-4 w-8">
                  <Ruler className="w-3.5 h-3.5" />
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Property
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Material / Type
                </TableHead>
                <SortableHeader
                  label="Sq Ft"
                  sortKey="sqft"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Squares"
                  sortKey="squares"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Replacement Cost"
                  sortKey="replacementCost"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Source
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide pr-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    No measurements match this filter.
                  </TableCell>
                </TableRow>
              )}
              {displayed.map((m, idx) => {
                const address = addressMap[m.propertyId] ?? m.propertyId;
                const isExpanded = expandedId === m.id;
                const hasIssue =
                  m.status === "needs_review" || m.status === "disputed";

                return (
                  <>
                    <TableRow
                      key={m.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100 cursor-pointer animate-fade-up-in"
                      style={{
                        animationDelay: `${idx * 40}ms`,
                        animationDuration: "120ms",
                        animationFillMode: "both",
                      }}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : m.id)
                      }
                    >
                      <TableCell className="pl-4 w-8">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold font-mono">
                          {idx + 1}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium truncate max-w-[160px]">
                            {address}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {m.id}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs">
                            {MATERIAL_LABELS[m.material]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {ROOF_TYPE_LABELS[m.roofType]}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs tabular-nums">
                          {m.sqft.toLocaleString("en-US")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {m.squares.toFixed(2)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs font-semibold text-foreground border-l-2 border-l-success/60 pl-1.5">
                            $
                            {Math.round(m.replacementCost).toLocaleString(
                              "en-US"
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground pl-1.5">
                            @ $6.33/sqft
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <SourceIcon source={m.source} />
                      </TableCell>

                      <TableCell className="pr-4">
                        <div className="flex items-center gap-1.5">
                          <MeasurementStatusBadge status={m.status} />
                          {hasIssue && (
                            <AlertTriangle className="w-3 h-3 text-warning shrink-0" />
                          )}
                          {m.status === "measured" && (
                            <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow key={`${m.id}-detail`}>
                        <TableCell
                          colSpan={8}
                          className="bg-muted/30 px-4 py-4"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Property Address
                              </p>
                              <p className="font-medium">{address}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Pitch
                              </p>
                              <p className="font-mono">{m.pitch ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Facets
                              </p>
                              <p className="font-mono">
                                {m.facets ?? "—"} sections
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Cost Formula
                              </p>
                              <p className="font-mono text-success">
                                {m.sqft.toLocaleString()} &times; $6.33 = $
                                {Math.round(m.replacementCost).toLocaleString()}
                              </p>
                            </div>
                            {m.reviewNote && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                  Review Note
                                </p>
                                <p className="text-warning-foreground bg-warning/8 rounded px-2 py-1">
                                  {m.reviewNote}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {disputedCount > 0 && (
          <div className="px-4 py-3 border-t border-warning/20 bg-warning/5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
            <p className="text-xs text-warning-foreground">
              <span className="font-semibold">
                {disputedCount} measurement
                {disputedCount !== 1 ? "s" : ""}
              </span>{" "}
              disputed by property owner — field re-measure required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
