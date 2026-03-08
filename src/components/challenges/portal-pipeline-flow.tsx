"use client";

import { useState } from "react";
import { Mail, FileSearch, MapPin, Database, CheckCircle2, ArrowRight, Play } from "lucide-react";

const steps = [
  {
    id: "email",
    label: "Portal Email",
    description: "6:00am trigger",
    icon: Mail,
    highlight: false,
    detail: "Insurance portal sends two CSV attachment emails at 6am with new property addresses from the previous evening.",
  },
  {
    id: "parse",
    label: "Address Parse",
    description: "Extract addresses",
    icon: FileSearch,
    highlight: true,
    detail: "Parser reads attachments, extracts street addresses, deduplicates against existing Deals, and queues new ones.",
  },
  {
    id: "lookup",
    label: "Atlas Lookup",
    description: "atlas.phila.gov",
    icon: MapPin,
    highlight: true,
    detail: "Each address hits the Philadelphia OPA API — returning homeowner name, mailing address, and OPA parcel number.",
  },
  {
    id: "pipedrive",
    label: "Pipedrive Deal",
    description: "Auto-create Deal",
    icon: Database,
    highlight: false,
    detail: "Deal created via Pipedrive API with address, owner name, mailing address, and OPA number pre-filled in custom fields.",
  },
  {
    id: "done",
    label: "Ready",
    description: "Before 7am",
    icon: CheckCircle2,
    highlight: false,
    detail: "Deals visible in Pipedrive before the first employee opens a laptop. No portal login required.",
  },
];

export function PortalPipelineFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const runAnimation = () => {
    setRunning(true);
    setActiveStep(0);
    steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i === steps.length - 1) {
          setTimeout(() => {
            setRunning(false);
            setActiveStep(null);
          }, 800);
        }
      }, i * 500);
    });
  };

  return (
    <div className="space-y-4">
      {/* Flow diagram */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-stretch gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i;
          const isDone = activeStep !== null && i < activeStep;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                className={[
                  "flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-all",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isActive
                    ? "border-primary bg-primary/10 shadow-[0_0_0_2px_oklch(0.52_0.17_148/0.15)]"
                    : isDone
                    ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/5"
                    : step.highlight
                    ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                    : "border-border/60 bg-card hover:border-border",
                ].join(" ")}
                style={{ transitionDuration: "120ms" }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={[
                      "w-3.5 h-3.5 shrink-0",
                      isActive
                        ? "text-primary"
                        : isDone
                        ? "text-[color:var(--success)]"
                        : step.highlight
                        ? "text-primary/70"
                        : "text-muted-foreground",
                    ].join(" ")}
                  />
                  <p className="text-xs font-medium leading-tight">{step.label}</p>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">{step.description}</p>
              </button>
              {i < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step detail panel */}
      {activeStep !== null && (
        <div
          className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
          style={{ transition: "all 120ms ease-out" }}
        >
          <p className="text-xs font-semibold text-primary mb-1">{steps[activeStep].label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{steps[activeStep].detail}</p>
        </div>
      )}

      {/* Run button */}
      <div className="flex items-center gap-3">
        <button
          onClick={runAnimation}
          disabled={running}
          className={[
            "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all",
            running
              ? "border-primary/20 bg-primary/5 text-primary/50 cursor-not-allowed"
              : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50",
          ].join(" ")}
          style={{ transitionDuration: "120ms" }}
        >
          <Play className="w-3 h-3" />
          {running ? "Running pipeline..." : "Simulate 6am run"}
        </button>
        <p className="text-[10px] text-muted-foreground">Click any step to see how it works</p>
      </div>
    </div>
  );
}
