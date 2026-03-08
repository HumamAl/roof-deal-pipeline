import type { LucideIcon } from "lucide-react";

// ─── Sidebar navigation ───────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge visualization types ───────────────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ─── Proposal types ───────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Screen definition for frame-based demo formats ──────────────────────────

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

// ─── Conversion element variant types ────────────────────────────────────────

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// =============================================================================
// DOMAIN TYPES — Roofing CRM / Philadelphia Contractor Automation
// =============================================================================

// ─── Pipeline Stage ───────────────────────────────────────────────────────────

/** The four automation steps a deal progresses through */
export type PipelineStage =
  | "pending_import"
  | "enriching"
  | "measurement_pending"
  | "ready_for_invoice"
  | "photo_processed"
  | "invoiced"
  | "lost";

/** Automation step number (1-4 badge shown on deal card) */
export type AutomationStep = 1 | 2 | 3 | 4;

// ─── Property / Parcel ────────────────────────────────────────────────────────

export type PropertyType = "residential" | "commercial" | "mixed_use" | "vacant_lot";

export type ImportBatchStatus = "in_progress" | "completed" | "partial" | "failed";

/** An import batch from the insurance portal (one per morning run) */
export interface ImportBatch {
  id: string;                       // "BATCH-2841"
  importedAt: string;               // ISO datetime
  sourceEmail: string;              // forwarded email subject / portal name
  propertyCount: number;            // how many properties were scraped
  status: ImportBatchStatus;
  failedCount: number;              // properties that failed to parse
  note?: string;                    // e.g. "Partial — portal timeout at record 14"
}

/** Raw property record scraped from the insurance portal */
export interface Property {
  id: string;                       // "PROP-7741"
  batchId: string;                  // → ImportBatch.id
  streetAddress: string;            // "1847 N Broad St"
  city: string;                     // "Philadelphia"
  state: string;                    // "PA"
  zip: string;                      // "19122"
  neighborhood: string;             // "North Philly", "Fishtown", etc.
  propertyType: PropertyType;
  importedAt: string;               // ISO datetime
  /** OPA number from atlas.phila.gov — may be null if not yet enriched */
  opaNumber?: string | null;
}

// ─── Homeowner Record (from atlas.phila.gov) ──────────────────────────────────

export type AtlasEnrichmentStatus =
  | "pending"
  | "enriched"
  | "stale_data"              // recently sold — owner data may be outdated
  | "no_match"                // OPA lookup returned no result (vacant lot, etc.)
  | "multiple_matches";       // OPA query returned ambiguous results

/** Owner data fetched from atlas.phila.gov via OPA number */
export interface HomeownerRecord {
  id: string;                       // "HO-0094"
  propertyId: string;               // → Property.id
  opaNumber: string;                // "883012400" — 9-digit OPA parcel number
  ownerName: string;                // as listed in OPA (often ALLCAPS)
  mailingAddress: string;           // may differ from property address (absentee)
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  assessedValue: number;            // OPA assessed value in dollars
  lastSaleDate?: string | null;     // ISO date — null if no recorded sale
  lastSalePrice?: number | null;
  enrichmentStatus: AtlasEnrichmentStatus;
  enrichedAt?: string | null;       // ISO datetime of last Atlas lookup
  /** Flagged when owner address matches the property (owner-occupied) */
  ownerOccupied: boolean;
  note?: string;                    // "Stale — sold 2025-11-03, new owner not yet in OPA"
}

// ─── Roof Measurement ─────────────────────────────────────────────────────────

export type RoofType = "flat" | "pitched_gable" | "hip" | "mansard" | "shed";
export type RoofMaterial = "asphalt_shingles" | "metal" | "tpo" | "epdm" | "slate" | "modified_bitumen";
export type MeasurementSource = "eagleview" | "manual_field" | "satellite_estimate" | "photo_extracted";
export type MeasurementStatus = "pending" | "measured" | "needs_review" | "disputed";

export interface RoofMeasurement {
  id: string;                       // "MEAS-4410"
  dealId: string;                   // → Deal.id
  propertyId: string;               // → Property.id
  roofType: RoofType;
  material: RoofMaterial;
  /** Total roof area in square feet */
  sqft: number;
  /** Roofing squares (1 square = 100 sqft) */
  squares: number;
  /** Replacement cost: sqft × $6.33 */
  replacementCost: number;
  /** Per-square cost rate used (default $6.33 × 100 = $633/square) */
  costPerSqft: number;
  pitch?: string;                   // "4/12", "6/12", "flat"
  /** Number of roof sections / facets */
  facets?: number;
  source: MeasurementSource;
  status: MeasurementStatus;
  measuredAt?: string | null;       // ISO datetime
  reviewNote?: string;              // present when status = "needs_review" | "disputed"
}

// ─── Photo Extraction ─────────────────────────────────────────────────────────

export type PhotoExtractionStatus =
  | "queued"
  | "processing"
  | "extracted"
  | "low_confidence"              // confidence < 0.75 — needs human review
  | "failed"                      // OCR returned no usable fields
  | "manually_corrected";

/** AI-extracted fields from a claim photo or damage report document */
export interface PhotoExtraction {
  id: string;                       // "EXTR-0093"
  dealId: string;                   // → Deal.id
  photoFileName: string;            // original upload filename
  /** 0.0 – 1.0 confidence score from extraction model */
  confidenceScore: number;
  status: PhotoExtractionStatus;
  /** Fields extracted by AI — null means the field was not found in the photo */
  extractedFields: {
    ownerName?: string | null;
    propertyAddress?: string | null;
    claimNumber?: string | null;
    damageDate?: string | null;
    adjustorName?: string | null;
    rcvAmount?: number | null;       // Replacement Cost Value from adjuster
    acvAmount?: number | null;       // Actual Cash Value
    deductible?: number | null;
    coverageType?: string | null;
  };
  processedAt?: string | null;
  reviewNote?: string;              // present when low_confidence or manually_corrected
}

// ─── Deal (core entity) ───────────────────────────────────────────────────────

/** The master deal record tying property → homeowner → measurement → extraction */
export interface Deal {
  id: string;                       // "DEAL-8821"
  propertyId: string;               // → Property.id
  homeownerId?: string | null;      // → HomeownerRecord.id (null until enriched)
  measurementId?: string | null;    // → RoofMeasurement.id (null until measured)
  extractionId?: string | null;     // → PhotoExtraction.id (null until photo processed)
  batchId: string;                  // → ImportBatch.id (which import created this deal)

  // Address (denormalized for fast display)
  streetAddress: string;
  neighborhood: string;
  zip: string;
  propertyType: PropertyType;

  // Pipeline
  stage: PipelineStage;
  /** Which of the 4 automation steps has been completed (1-4) */
  automationStep: AutomationStep;

  // Homeowner (populated after Atlas enrichment)
  ownerName?: string | null;
  mailingAddress?: string | null;

  // Measurement (populated after roof measure)
  sqft?: number | null;
  squares?: number | null;
  replacementCost?: number | null;

  // Photo extraction
  claimNumber?: string | null;
  rcvAmount?: number | null;
  photoConfidence?: number | null;

  // Metadata
  importedAt: string;               // ISO datetime
  enrichedAt?: string | null;
  measuredAt?: string | null;
  photoProcessedAt?: string | null;
  invoicedAt?: string | null;

  /** Rush flag — set when deal has a tight adjuster inspection deadline */
  isRush: boolean;
  note?: string;
}

// ─── Deal Activity Log ────────────────────────────────────────────────────────

export type ActivityType =
  | "imported"
  | "atlas_enriched"
  | "atlas_failed"
  | "measurement_ordered"
  | "measurement_received"
  | "photo_queued"
  | "photo_extracted"
  | "photo_low_confidence"
  | "invoice_generated"
  | "note_added"
  | "stage_changed";

export interface DealActivity {
  id: string;                       // "ACT-2294"
  dealId: string;                   // → Deal.id
  type: ActivityType;
  description: string;
  performedBy: "system" | "humam";
  timestamp: string;                // ISO datetime
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  /** Total deals imported today */
  dealsImportedToday: number;
  dealsImportedTodayChange: number;         // % vs yesterday
  /** Percentage of deals with completed Atlas enrichment */
  enrichmentCompletionRate: number;         // 0-100
  enrichmentRateChange: number;
  /** Average roof replacement cost across all measured deals */
  avgReplacementCost: number;               // dollars
  avgReplacementCostChange: number;
  /** Total sqft measured this month */
  totalSqftMeasured: number;
  sqftMeasuredChange: number;
  /** Number of photos processed by AI this week */
  photosProcessedThisWeek: number;
  photosProcessedChange: number;
  /** Deals ready for invoice (stage = ready_for_invoice) */
  readyForInvoice: number;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export interface DealImportDataPoint {
  month: string;
  dealsImported: number;
  enriched: number;
  measured: number;
}

export interface StageBreakdownDataPoint {
  stage: string;
  count: number;
  fill?: string;
}

export interface ReplacementCostDataPoint {
  month: string;
  avgCost: number;
  totalSqft: number;
}

export interface NeighborhoodDataPoint {
  neighborhood: string;
  deals: number;
  avgSqft: number;
  avgReplacementCost: number;
}

// ─── Pipeline Stage Summary (for hero pipeline flow display) ──────────────────

export interface PipelineStageSummary {
  stage: PipelineStage;
  label: string;
  stepNumber: AutomationStep;
  count: number;
  description: string;
}
