import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "I build tools that replace manual workflows — scraping, enrichment, OCR, CRM automation.",
  bio: "Full-stack developer with hands-on experience in AI extraction pipelines, CRM integrations, and document processing. I've built systems that pull structured data out of emails, PDFs, and photos — and push it cleanly into dashboards where a business owner can act on it.",
  approach: [
    {
      title: "Map the Sources",
      description:
        "Week 1 — understand exactly how your portal emails are structured, what Pipedrive pipeline stages you use today, and what edge cases exist. No assumptions.",
    },
    {
      title: "Build the Scraping + Import Pipeline",
      description:
        "Week 2–3 — email parser extracts property addresses and pushes new Deals into Pipedrive automatically. Atlas.phila.gov enrichment runs for each deal, pulling owner name, OPA number, and assessed value.",
    },
    {
      title: "Roof Measurement + Photo Extraction",
      description:
        "Week 4–5 — sqft-to-cost calculation at $6.33/sqft updates each deal. AI photo reader (GPT-4V or similar) extracts claim number, RCV, deductible, and adjustor name from inspection photos.",
    },
    {
      title: "Testing + Handoff",
      description:
        "Week 6+ — run with your real portal emails, fix edge cases, document the system so you can hand it off to anyone. No black box.",
    },
  ],
  skillCategories: [
    {
      name: "Automation & Scraping",
      skills: [
        "Puppeteer",
        "Playwright",
        "Email Parsing",
        "n8n",
        "Webhook Integrations",
      ],
    },
    {
      name: "AI & Document Extraction",
      skills: [
        "GPT-4V / Vision APIs",
        "Claude API",
        "OCR Pipelines",
        "Structured Output",
        "Confidence Scoring",
      ],
    },
    {
      name: "CRM & APIs",
      skills: [
        "Pipedrive API",
        "REST API Design",
        "Philadelphia Open Data (OPA)",
        "Node.js",
      ],
    },
    {
      name: "Frontend & Dashboards",
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wmf-agent",
    title: "WMF Agent Dashboard",
    description:
      "AI-powered email processing pipeline for Windsor Metal Finishing. Automated email classification, RFQ data extraction with confidence scoring, and human-in-the-loop approval workflow — closest match to the photo OCR and data extraction work in your project.",
    tech: ["Next.js", "Claude API", "n8n", "Microsoft Graph", "TypeScript"],
    outcome:
      "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
    relevance:
      "Same pattern as your photo text reader: unstructured input → AI extraction → structured fields → human review",
    liveUrl: "https://wmf-agent-dashboard.vercel.app",
  },
  {
    id: "medrecord-ai",
    title: "MedRecord AI",
    description:
      "AI-powered document processing that extracts structured clinical data, diagnoses, medications, and timelines from patient records — document parsing and structured output at scale.",
    tech: ["Next.js", "TypeScript", "AI Extraction Pipeline", "shadcn/ui"],
    outcome:
      "Document processing pipeline that extracts structured clinical data and generates a readable timeline summary",
    relevance:
      "Directly applicable to your inspection photo reader — same extraction → structured fields → dashboard display pattern",
    liveUrl: "https://medrecord-ai-delta.vercel.app",
  },
  {
    id: "lead-crm",
    title: "Lead Intake CRM",
    description:
      "Custom lead intake and automation system with public intake form, CRM dashboard, lead scoring, pipeline management, and automation rules engine. Built the full deal flow — intake to scored pipeline.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    outcome:
      "End-to-end lead flow — public intake form to scored pipeline with configurable automation rules",
    relevance:
      "Shows I understand pipeline management and automation rules — the same structure your Pipedrive integration needs",
  },
  {
    id: "ebay-monitor",
    title: "eBay Pokemon Monitor",
    description:
      "Real-time third-party API monitoring tool with scheduled polling, webhook-based Discord alerts, and price trend tracking. Shows REST API integration and scheduled job patterns.",
    tech: ["Next.js", "TypeScript", "eBay Browse API", "Webhooks", "shadcn/ui"],
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    relevance:
      "Same integration pattern as hitting the Atlas Philadelphia API on a schedule to enrich deal records",
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
  },
];
