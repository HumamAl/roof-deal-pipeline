"use client";

import { useState } from "react";
import { X, Check, FileImage, Brain, AlertTriangle, Clock } from "lucide-react";

const manualItems = [
  "Employee opens photo in separate viewer",
  "Reads claim number — types manually into Pipedrive",
  "Looks up RCV amount — types into custom field",
  "Reads deductible — cross-checks with email thread",
  "Transcribes damage notes — prone to typos",
  "4–6 minutes per photo, longer for multi-page reports",
];

const automatedItems = [
  "Photo uploaded to Pipedrive deal record",
  "OCR + AI extracts claim number, RCV, deductible",
  "Structured fields written to Pipedrive via API",
  "Confidence score calculated per extraction",
  "Low-confidence results routed to review queue",
  "Average processing time: 8–12 seconds per photo",
];

const exampleExtraction = {
  claimNumber: "PHL-2024-88341",
  rcvAmount: "$18,420.00",
  deductible: "$1,500.00",
  damageDate: "2024-10-12",
  adjustorName: "R. Castellano",
  confidence: 0.94,
};

export function PhotoExtractionToggle() {
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border/60 bg-muted/40 w-fit">
        <button
          onClick={() => setView("before")}
          className={[
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            view === "before"
              ? "bg-card border border-destructive/20 text-destructive shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          style={{ transitionDuration: "120ms" }}
        >
          Current process
        </button>
        <button
          onClick={() => setView("after")}
          className={[
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            view === "after"
              ? "bg-card border border-[color:var(--success)]/20 text-[color:var(--success)] shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          style={{ transitionDuration: "120ms" }}
        >
          With AI extraction
        </button>
      </div>

      {view === "before" ? (
        <div
          className="rounded-lg border p-4 space-y-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
            borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-destructive/70" />
            <span className="text-xs font-semibold text-destructive">Manual transcription — 4–6 min per photo</span>
          </div>
          <ul className="space-y-1.5">
            {manualItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-destructive/80">
                <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-destructive" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="rounded-lg border p-4 space-y-2"
            style={{
              backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
              borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[color:var(--success)]" />
              <span className="text-xs font-semibold text-[color:var(--success)]">AI extraction — ~10 seconds per photo</span>
            </div>
            <ul className="space-y-1.5">
              {automatedItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[color:var(--success)]">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Sample extraction output */}
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileImage className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                Sample extraction output
              </span>
              <span
                className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
                  color: "var(--success)",
                }}
              >
                {Math.round(exampleExtraction.confidence * 100)}% confidence
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {Object.entries(exampleExtraction)
                .filter(([k]) => k !== "confidence")
                .map(([key, val]) => (
                  <div key={key}>
                    <p className="text-[10px] text-muted-foreground font-mono capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-xs font-medium font-mono">{String(val)}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Low-confidence note */}
          <div
            className="flex items-start gap-2 rounded-md px-3 py-2"
            style={{
              backgroundColor: "color-mix(in oklch, var(--warning) 8%, transparent)",
              borderColor: "color-mix(in oklch, var(--warning) 20%, transparent)",
              border: "1px solid",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[color:var(--warning)]" />
            <p className="text-xs text-[color:var(--warning)]">
              Extractions below 75% confidence are flagged and held in a review queue — they never auto-write to Pipedrive.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
