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
import { homeownerRecords, properties } from "@/data/mock-data";
import type { HomeownerRecord, AtlasEnrichmentStatus } from "@/lib/types";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Download,
  Zap,
  Home,
  MapPin,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Status config ─────────────────────────────────────────────────────────────

const ENRICHMENT_CONFIG: Record<
  AtlasEnrichmentStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  enriched: {
    label: "Enriched",
    className:
      "bg-success/10 text-success border-success/30 font-mono text-[10px]",
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
  },
  stale_data: {
    label: "Stale Data",
    className:
      "bg-warning/10 text-warning-foreground border-warning/30 font-mono text-[10px]",
    icon: <AlertTriangle className="w-2.5 h-2.5" />,
  },
  no_match: {
    label: "No Match",
    className:
      "bg-destructive/10 text-destructive border-destructive/25 font-mono text-[10px]",
    icon: <XCircle className="w-2.5 h-2.5" />,
  },
  multiple_matches: {
    label: "Ambiguous",
    className:
      "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    icon: <HelpCircle className="w-2.5 h-2.5" />,
  },
  pending: {
    label: "Pending",
    className:
      "bg-muted text-muted-foreground border-border font-mono text-[10px]",
    icon: <Database className="w-2.5 h-2.5" />,
  },
};

function EnrichmentStatusBadge({ status }: { status: AtlasEnrichmentStatus }) {
  const c = ENRICHMENT_CONFIG[status];
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function freshness(iso: string | null | undefined): {
  label: string;
  color: string;
} {
  if (!iso) return { label: "—", color: "text-muted-foreground" };
  const now = new Date("2026-03-07");
  const d = new Date(iso);
  const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return { label: "Today", color: "text-success" };
  if (days <= 1) return { label: "Yesterday", color: "text-success" };
  if (days <= 3) return { label: `${days}d ago`, color: "text-success" };
  if (days <= 7) return { label: `${days}d ago`, color: "text-warning" };
  return { label: `${days}d ago`, color: "text-muted-foreground" };
}

// ── Summary cards ─────────────────────────────────────────────────────────────

function SummaryCards() {
  const all = homeownerRecords;
  const enriched = all.filter((h) => h.enrichmentStatus === "enriched").length;
  const stale = all.filter((h) => h.enrichmentStatus === "stale_data").length;
  const noMatch = all.filter((h) => h.enrichmentStatus === "no_match").length;
  const ownerOccupied = all.filter((h) => h.ownerOccupied).length;

  const cards = [
    {
      label: "Enriched via Atlas",
      value: enriched.toString(),
      sub: `${((enriched / all.length) * 100).toFixed(0)}% OPA lookup success`,
      enriched: true,
    },
    {
      label: "Stale / Recent Sales",
      value: stale.toString(),
      sub: "owner data may be outdated",
      alert: stale > 0,
    },
    {
      label: "No OPA Match",
      value: noMatch.toString(),
      sub: "vacant lot or unregistered",
      destructive: noMatch > 0,
    },
    {
      label: "Owner-Occupied",
      value: ownerOccupied.toString(),
      sub: `${all.length - ownerOccupied} absentee landlords`,
      enriched: false,
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
              card.enriched
                ? "text-success"
                : card.alert
                ? "text-warning"
                : card.destructive
                ? "text-destructive"
                : "text-primary"
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

// ── Sort helper ───────────────────────────────────────────────────────────────

type SortKey = "ownerName" | "assessedValue" | "enrichedAt" | "lastSaleDate";
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

export default function HomeownerRecordsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    AtlasEnrichmentStatus | "all"
  >("all");
  const [occupancyFilter, setOccupancyFilter] = useState<
    "all" | "owner" | "absentee"
  >("all");
  const [sortKey, setSortKey] = useState<SortKey>("enrichedAt");
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

  // Build address map from properties
  const addressMap = useMemo(() => {
    const map: Record<string, string> = {};
    properties.forEach((p) => {
      map[p.id] = p.streetAddress;
    });
    return map;
  }, []);

  const displayed = useMemo(() => {
    let list = [...homeownerRecords];

    if (statusFilter !== "all") {
      list = list.filter((h) => h.enrichmentStatus === statusFilter);
    }
    if (occupancyFilter === "owner") {
      list = list.filter((h) => h.ownerOccupied);
    } else if (occupancyFilter === "absentee") {
      list = list.filter((h) => !h.ownerOccupied);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.ownerName.toLowerCase().includes(q) ||
          h.opaNumber.includes(q) ||
          (addressMap[h.propertyId] ?? "").toLowerCase().includes(q) ||
          h.mailingAddress.toLowerCase().includes(q) ||
          h.id.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === "ownerName") {
        av = a.ownerName;
        bv = b.ownerName;
      } else if (sortKey === "assessedValue") {
        av = a.assessedValue;
        bv = b.assessedValue;
      } else if (sortKey === "enrichedAt") {
        av = a.enrichedAt ?? "";
        bv = b.enrichedAt ?? "";
      } else {
        av = a.lastSaleDate ?? "";
        bv = b.lastSaleDate ?? "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [search, statusFilter, occupancyFilter, sortKey, sortDir, addressMap]);

  const staleCount = homeownerRecords.filter(
    (h) => h.enrichmentStatus === "stale_data"
  ).length;
  const noMatchCount = homeownerRecords.filter(
    (h) => h.enrichmentStatus === "no_match"
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
            Homeowner Records
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            atlas.phila.gov OPA enrichment results &middot;{" "}
            {homeownerRecords.length} records &middot; OPA numbers in mono font
          </p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">
          <Download className="w-3 h-3 mr-1.5" />
          Export
        </Button>
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      <SummaryCards />

      {/* ── Atlas source callout ─────────────────────────────────── */}
      <div className="aesthetic-card px-4 py-3 flex items-center gap-3 bg-primary/5 border-primary/20">
        <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <Database className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">
            Automated Atlas OPA Lookup
          </p>
          <p className="text-[11px] text-muted-foreground">
            Owner data fetched from atlas.phila.gov using the OPA parcel
            number. Each record is re-enriched when a deal enters the pipeline.
            Stale records reflect recent sales not yet updated in OPA.
          </p>
        </div>
        <div className="shrink-0">
          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-success border border-success/30 bg-success/8 rounded px-1.5 py-0.5">
            <Zap className="w-2.5 h-2.5" />
            Auto-enriched
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="aesthetic-card overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 pt-4 pb-3 border-b border-border/60 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search owner name, OPA number, address…"
              className="pl-8 h-7 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as AtlasEnrichmentStatus | "all")
            }
          >
            <SelectTrigger className="h-7 text-xs w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="enriched">Enriched</SelectItem>
              <SelectItem value="stale_data">Stale Data</SelectItem>
              <SelectItem value="no_match">No Match</SelectItem>
              <SelectItem value="multiple_matches">Ambiguous</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Occupancy filter chips */}
          <div className="flex items-center gap-1">
            {(
              [
                { key: "all" as const, label: "All" },
                {
                  key: "owner" as const,
                  label: "Owner-Occupied",
                  icon: <Home className="w-2.5 h-2.5" />,
                },
                {
                  key: "absentee" as const,
                  label: "Absentee",
                  icon: <MapPin className="w-2.5 h-2.5" />,
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setOccupancyFilter(opt.key)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-colors duration-100",
                  occupancyFilter === opt.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {"icon" in opt && opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground shrink-0">
            {displayed.length} record{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide pl-4">
                  <Users className="w-3.5 h-3.5" />
                </TableHead>
                <SortableHeader
                  label="Owner Name"
                  sortKey="ownerName"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  OPA Number
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Property Address
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Mailing Address
                </TableHead>
                <SortableHeader
                  label="Assessed Value"
                  sortKey="assessedValue"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
                <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </TableHead>
                <SortableHeader
                  label="Last Enriched"
                  sortKey="enrichedAt"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    No homeowner records match this filter.
                  </TableCell>
                </TableRow>
              )}
              {displayed.map((ho, idx) => {
                const address = addressMap[ho.propertyId] ?? ho.propertyId;
                const isExpanded = expandedId === ho.id;
                const { label: freshnessLabel, color: freshnessColor } =
                  freshness(ho.enrichedAt);
                const isAbsentee =
                  !ho.ownerOccupied &&
                  ho.enrichmentStatus === "enriched";

                return (
                  <>
                    <TableRow
                      key={ho.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100 cursor-pointer animate-fade-up-in"
                      style={{
                        animationDelay: `${idx * 35}ms`,
                        animationDuration: "120ms",
                        animationFillMode: "both",
                      }}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : ho.id)
                      }
                    >
                      {/* Occupancy indicator */}
                      <TableCell className="pl-4 w-8">
                        <span
                          title={
                            ho.ownerOccupied
                              ? "Owner-occupied"
                              : "Absentee landlord"
                          }
                        >
                          {ho.ownerOccupied ? (
                            <Home className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                          )}
                        </span>
                      </TableCell>

                      {/* Owner name */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium">
                            {titleCase(ho.ownerName)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {ho.id}
                          </span>
                        </div>
                      </TableCell>

                      {/* OPA number — mono font, green left-border (auto-enriched) */}
                      <TableCell>
                        {ho.enrichmentStatus === "enriched" ||
                        ho.enrichmentStatus === "stale_data" ? (
                          <span className="font-mono text-[11px] text-foreground border-l-2 border-l-success/60 pl-1.5">
                            {ho.opaNumber}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-muted-foreground/50">
                            {ho.opaNumber}
                          </span>
                        )}
                      </TableCell>

                      {/* Property address */}
                      <TableCell>
                        <span className="text-xs text-muted-foreground truncate max-w-[140px] block">
                          {address}
                        </span>
                      </TableCell>

                      {/* Mailing address — flag absentee */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs truncate max-w-[140px]">
                            {ho.mailingAddress}
                          </span>
                          {isAbsentee && (
                            <span className="text-[10px] text-warning-foreground flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Absentee landlord
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Assessed value */}
                      <TableCell>
                        <span className="font-mono text-xs tabular-nums">
                          $
                          {ho.assessedValue.toLocaleString("en-US")}
                        </span>
                      </TableCell>

                      {/* Enrichment status */}
                      <TableCell>
                        <EnrichmentStatusBadge
                          status={ho.enrichmentStatus}
                        />
                      </TableCell>

                      {/* Freshness */}
                      <TableCell>
                        <span
                          className={cn(
                            "text-[10px] font-mono",
                            freshnessColor
                          )}
                        >
                          {freshnessLabel}
                        </span>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow key={`${ho.id}-detail`}>
                        <TableCell
                          colSpan={8}
                          className="bg-muted/30 px-4 py-4"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Full Owner Name (OPA)
                              </p>
                              <p className="font-mono text-[11px]">
                                {ho.ownerName}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Mailing City / State
                              </p>
                              <p>
                                {ho.mailingCity}, {ho.mailingState}{" "}
                                {ho.mailingZip}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Last Sale Date
                              </p>
                              <p className="font-mono">
                                {formatDate(ho.lastSaleDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Last Sale Price
                              </p>
                              <p className="font-mono">
                                {ho.lastSalePrice != null
                                  ? "$" +
                                    ho.lastSalePrice.toLocaleString("en-US")
                                  : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                OPA Number
                              </p>
                              <p className="font-mono border-l-2 border-l-success/60 pl-1.5">
                                {ho.opaNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Enriched At
                              </p>
                              <p className="font-mono">
                                {formatDate(ho.enrichedAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Occupancy
                              </p>
                              <p>
                                {ho.ownerOccupied
                                  ? "Owner-occupied"
                                  : "Absentee landlord"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                Atlas Source
                              </p>
                              <p className="text-success flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" />
                                atlas.phila.gov
                              </p>
                            </div>
                            {ho.note && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-muted-foreground uppercase tracking-wide text-[10px] mb-1">
                                  Note
                                </p>
                                <p className="bg-warning/8 text-warning-foreground rounded px-2 py-1">
                                  {ho.note}
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

        {/* Edge case callouts */}
        {(staleCount > 0 || noMatchCount > 0) && (
          <div className="border-t border-border/40 divide-y divide-border/40">
            {staleCount > 0 && (
              <div className="px-4 py-3 bg-warning/5 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                <p className="text-xs text-warning-foreground">
                  <span className="font-semibold">{staleCount} stale record{staleCount !== 1 ? "s" : ""}</span>{" "}
                  — property recently sold, new owner not yet updated in OPA.
                  Contact old owner may fail.
                </p>
              </div>
            )}
            {noMatchCount > 0 && (
              <div className="px-4 py-3 bg-destructive/5 flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <p className="text-xs text-destructive">
                  <span className="font-semibold">{noMatchCount} no-match record{noMatchCount !== 1 ? "s" : ""}</span>{" "}
                  — vacant lot or city-owned land. No homeowner to contact.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
