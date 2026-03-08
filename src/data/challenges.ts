import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers handed a job like this build a form that triggers an API call — they automate the button click but leave the same manual decision-making intact. The morning routine still exists, just with nicer UI.",
  differentApproach:
    "I'd wire the entire pipeline end-to-end: portal emails arrive at 6am, addresses parse automatically, Atlas enrichment runs in parallel, and every Deal lands in Pipedrive fully populated — owner name, mailing address, sqft, and replacement cost — before anyone opens a laptop.",
  accentWord: "fully populated",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Morning Portal Scrape and Pipedrive Deal Creation",
    description:
      "Right now someone logs into the insurance portal each morning, reviews new properties from the previous evening, and manually enters each address as a Pipedrive Deal. Two trigger emails arrive at 6:00am — but the actual data entry doesn't happen until a person sits down. That window is wasted time.",
    visualizationType: "flow",
    outcome:
      "Could eliminate the daily manual login and data entry entirely — Deals flow into Pipedrive automatically each morning before business opens, with addresses parsed directly from the portal emails.",
  },
  {
    id: "challenge-2",
    title: "Philadelphia Atlas Enrichment at Scale",
    description:
      "After each Deal is created, someone visits atlas.phila.gov, searches the address, and copies the homeowner name plus mailing address into Pipedrive. Around 3 minutes per property. At 10-20 new Deals a day, that's up to an hour of pure copy-paste work on a single workflow.",
    visualizationType: "metrics",
    outcome:
      "Could reduce homeowner lookup time from ~3 minutes per property to near-zero — OPA number, owner name, and mailing address auto-populate into every Pipedrive Deal immediately after import.",
  },
  {
    id: "challenge-3",
    title: "AI Photo Text Extraction Replacing Manual Data Entry",
    description:
      "Employees read inspection photos and type extracted information — claim numbers, RCV amounts, damage notes — into Pipedrive deal records by hand. This is the highest-friction step in the workflow. A single adjuster report photo can take 4-6 minutes to transcribe accurately.",
    visualizationType: "before-after",
    outcome:
      "Could replace manual photo transcription entirely — AI extracts claim number, RCV, deductible, and damage fields from uploaded photos in seconds, routing low-confidence extractions to a review queue instead of guessing.",
  },
  {
    id: "challenge-4",
    title: "Roof Measurement and $6.33/sqft Cost Calculation Pipeline",
    description:
      "After a Deal is enriched, someone measures the roof surface area using Google Maps or the Atlas measuring tool, multiplies by $6.33 per square foot to get replacement cost, then manually enters both numbers into the Deal and the invoice. One more manual step that compounds error risk and slows invoicing.",
    visualizationType: "dual-kpi",
    outcome:
      "Could auto-calculate replacement cost and pre-fill invoice line items — aerial measurement API returns sqft, the pipeline multiplies by $6.33, and the Deal updates in Pipedrive before the estimator opens it.",
  },
];
