import Link from "next/link";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { PortalPipelineFlow } from "@/components/challenges/portal-pipeline-flow";
import { AtlasEnrichmentMetrics } from "@/components/challenges/atlas-enrichment-metrics";
import { PhotoExtractionToggle } from "@/components/challenges/photo-extraction-toggle";
import { RoofMeasurementKPI } from "@/components/challenges/roof-measurement-kpi";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "My Approach | RoofPipe",
};

function getVisualization(id: string) {
  switch (id) {
    case "challenge-1": return <PortalPipelineFlow />;
    case "challenge-2": return <AtlasEnrichmentMetrics />;
    case "challenge-3": return <PhotoExtractionToggle />;
    case "challenge-4": return <RoofMeasurementKPI />;
    default: return null;
  }
}

export default function ChallengesPage() {
  // Build executive summary with accent word highlighting
  const { commonApproach, differentApproach, accentWord } = executiveSummary;
  const accentEscaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = differentApproach.split(new RegExp(`(${accentEscaped})`, "i"));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the four automation challenges in this pipeline
          </p>
        </div>

        {/* Executive summary — dark banner */}
        <div
          className="relative overflow-hidden rounded-lg p-6 md:p-8 space-y-4"
          style={{
            background: "oklch(0.10 0.02 148)",
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, oklch(0.52 0.17 148 / 0.08), transparent 65%)",
          }}
        >
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors block"
            style={{ transitionDuration: "120ms" }}
          >
            ← Back to the live demo
          </Link>
          <p className="text-sm leading-relaxed text-white/50">{commonApproach}</p>
          <hr className="border-white/10" />
          <p className="text-base md:text-lg leading-relaxed font-medium text-white/90">
            {parts.map((part, i) =>
              part.toLowerCase() === accentWord.toLowerCase() ? (
                <span key={i} className="text-primary font-semibold">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>

        {/* Challenge cards */}
        <div className="flex flex-col gap-6">
          {challenges.map((challenge, index) => (
            <div key={challenge.id}>
              {/* Step number badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs font-semibold text-primary/60 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <ChallengeCard
                title={challenge.title}
                description={challenge.description}
                outcome={undefined}
              >
                {/* Visualization */}
                {getVisualization(challenge.id)}

                {/* Outcome statement */}
                {challenge.outcome && (
                  <div
                    className="flex items-start gap-2 rounded-md px-3 py-2"
                    style={{
                      backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--success) 15%, transparent)",
                    }}
                  >
                    <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
                    <p className="text-xs font-medium text-[color:var(--success)]">
                      {challenge.outcome}
                    </p>
                  </div>
                )}
              </ChallengeCard>
            </div>
          ))}
        </div>

        {/* CTA closer */}
        <section
          className="p-6 rounded-lg border border-primary/20"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--primary) 4%, transparent), transparent)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold mb-1">
                Ready to talk through the implementation?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                These aren&apos;t hypotheticals — I&apos;ve mapped the actual pipeline from portal email to Pipedrive Deal. Happy to walk through any of it.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/proposal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                style={{ transitionDuration: "120ms" }}
              >
                See the proposal →
              </Link>
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-md border border-primary/20 text-primary"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklch, var(--primary) 8%, transparent), color-mix(in oklch, var(--primary) 4%, transparent))",
                }}
              >
                Reply on Upwork to start
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
