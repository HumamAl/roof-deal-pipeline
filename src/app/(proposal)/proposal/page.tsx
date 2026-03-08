import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";
import { TimelineSection } from "@/components/proposal/timeline-section";

export const metadata = { title: "Work With Me | Roof Deal Pipeline" };

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* ── Section 1: Hero — dark panel, project-first ─────── */}
        <section
          className="relative rounded-lg overflow-hidden"
          style={{ background: "oklch(0.10 0.02 var(--primary-h, 148))" }}
        >
          {/* Subtle radial tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 30%, oklch(0.52 0.17 148 / 0.10), transparent 60%)",
            }}
          />

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 space-y-5">
            {/* Effort badge — mandatory */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1"
              style={{ background: "oklch(1 0 0 / 0.08)" }}>
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="font-mono text-xs tracking-wider text-white/70">
                Built this demo for your project
              </span>
            </div>

            {/* Role prefix */}
            <p className="font-mono text-xs tracking-widest uppercase text-white/40">
              Full-Stack Developer
            </p>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl tracking-tight leading-none">
              <span className="font-light text-white/70">Hi, I&apos;m </span>
              <span className="font-bold text-white">{profile.name}</span>
            </h1>

            {/* Value prop — specific to this job */}
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              I build CRM automation tools that replace the morning data entry — portal emails scraped, Pipedrive deals created, homeowner data enriched, and roof costs calculated, all before your first coffee. I&apos;ve already built {APP_CONFIG.projectName} to show you how it works.
            </p>
          </div>

          {/* Stats shelf */}
          <div
            className="relative z-10 border-t border-white/10 px-8 py-4 md:px-12"
            style={{ background: "oklch(1 0 0 / 0.05)" }}
          >
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">24+</div>
                <div className="text-xs text-white/50 mt-0.5">projects shipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">15+</div>
                <div className="text-xs text-white/50 mt-0.5">industries served</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">&lt; 48hr</div>
                <div className="text-xs text-white/50 mt-0.5">demo turnaround</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Proof of Work ─────────────────────────── */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Proof of Work
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Relevant Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Built for real clients. Outcomes listed are exact — not estimates.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tech={project.tech}
                relevance={project.relevance}
                outcome={project.outcome}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        </section>

        {/* ── Section 3: How I Work ─────────────────────────────── */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Process
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">How I Work</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Phased delivery. Visible progress each week. No surprises at handoff.
            </p>
          </div>
          <TimelineSection
            phases={profile.approach.map((step, i) => ({
              title: step.title,
              description: step.description,
              duration: "",
              status: (
                i === 0 ? "completed" : i === 1 ? "active" : "upcoming"
              ) as "completed" | "active" | "upcoming",
            }))}
          />
        </section>

        {/* ── Section 4: Skills Grid ────────────────────────────── */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Tech Stack
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">What I Build With</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Filtered to what this project actually needs — no filler.
            </p>
          </div>
          <SkillsGrid categories={profile.skillCategories} />
        </section>

        {/* ── Section 5: CTA — dark panel close ─────────────────── */}
        <section
          className="relative rounded-lg overflow-hidden text-center"
          style={{ background: "oklch(0.10 0.02 var(--primary-h, 148))" }}
        >
          <div className="px-8 py-10 md:px-12 md:py-12 space-y-4">
            {/* Pulsing availability indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
              </span>
              <span
                className="text-sm"
                style={{
                  color: "color-mix(in oklch, var(--success) 80%, white)",
                }}
              >
                Currently available for new projects
              </span>
            </div>

            {/* Headline — tailored to this job */}
            <h2 className="text-2xl font-semibold text-white">
              Your morning data entry shouldn&apos;t take hours.
            </h2>

            {/* Body — specific to this project */}
            <p className="text-white/70 max-w-md mx-auto leading-relaxed text-sm">
              I&apos;ve already built the pipeline demo — portal scraping, Atlas enrichment, roof cost calculation, and photo OCR. The production version connects to your real Pipedrive account and starts shipping deals automatically on day one.
            </p>

            {/* Primary action — text, not a dead link */}
            <p className="text-base font-semibold text-white pt-2">
              Reply on Upwork to start
            </p>

            {/* Secondary — back to demo */}
            <a
              href="/"
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              ← Back to the demo
            </a>

            {/* Signature */}
            <p className="pt-4 text-sm text-white/30 border-t border-white/10 mt-4">
              — Humam
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
