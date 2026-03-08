# Domain Knowledge Brief — Philadelphia Residential Roofing Contractor CRM

## Sub-Domain Classification

Independent roofing contractor company operating in Philadelphia, PA (small-to-mid scale, 2-8 field crews, 50-200 jobs/year). Primarily residential work on Philadelphia row homes and twin houses, with some commercial flat roof work. Uses Pipedrive as CRM for deal pipeline management, enriched with Philadelphia OPA property data (atlas.phila.gov) pulled by address to pre-populate property size and owner info. Deal volume primarily sourced from door-to-door canvassing, storm response, portal leads (HomeAdvisor/Angi), and referrals.

---

## Job Analyst Vocabulary — Confirmed and Extended

### Confirmed Primary Entity Names

These words must appear verbatim in every UI label — sidebar nav, table headers, KPI card titles, status badges, search placeholders:

- **Primary record type**: "deal" (Pipedrive native; NOT "project", NOT "job" at pipeline level — though "job" is used post-sale for production tracking)
- **Sales record**: "deal" (pipeline), "job" (production/crew scheduling phase)
- **Property owner / contact**: "contact" (Pipedrive), "homeowner" (in field/estimate context)
- **People roles**: "rep" or "sales rep" (not "salesperson"), "crew lead" (not "foreman"), "estimator" (sometimes same as rep)
- **Measurement event**: "measurement" or "site visit" (NOT "inspection" unless insurance claim context)
- **Secondary entities**: "estimate", "proposal", "contract", "permit", "invoice"
- **Revenue unit**: "squares" (1 sq = 100 sqft) — this is the KEY insider term; never say "square feet" in pricing contexts
- **Roof sections**: "field" (main plane), "ridge", "valley", "hip", "eave", "rake", "flashing"

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Open Pipeline Value | Total $ value of all non-closed deals | $ (e.g., $247,500) |
| Close Rate | % of quoted deals that become contracts | % (e.g., 31%) |
| Avg Deal Value | Mean revenue per won deal | $ (e.g., $14,200) |
| Weighted Pipeline | Probability-adjusted deal value sum | $ |
| Quote-to-Visit Ratio | % of site visits that result in a sent estimate | % |
| Lead-to-Book Rate | % of incoming leads converted to site visits | % |
| Deals by Stage | Count of deals in each pipeline stage | Count per stage |
| Days in Stage | Average age of deals in each pipeline stage | Days |
| Revenue MTD / YTD | Month/year to date won deal revenue | $ |
| Gross Margin % | (Revenue - Materials - Labor) / Revenue | % (target 35-50%) |
| Avg Squares per Job | Average roof size in squares for won deals | Squares (e.g., 22.4 sq) |
| Pipeline Velocity | (Leads × Close Rate × Avg Deal Value) / Sales Cycle | $/day |
| Recall Rate | % of completed jobs requiring warranty return | % (target <5%) |
| Booking Rate | % of inbound leads that become site visits | % |

### Status Label Vocabulary

Exact status strings used in roofing CRM pipelines — use these verbatim in data tables, badges, and filter dropdowns:

**Pipeline Stages (Pipedrive stages — ordered):**
- `Lead In` — new unqualified inquiry
- `Contacted` — first call/door knock made, conversation had
- `Site Visit Scheduled` — appointment booked, rep assigned
- `Measured` — site visit done, measurements taken
- `Estimate Sent` — written proposal sent to homeowner
- `Negotiating` — homeowner has questions, counter-offer in play
- `Won` — contract signed, deposit collected
- `Lost` — deal closed, not awarded

**Job (Production) Statuses (post-Won):**
- `Pending Permit` — permit application submitted, awaiting L&I approval
- `Materials Ordered` — shingles/membrane ordered from supplier
- `Scheduled` — crew date confirmed with homeowner
- `In Progress` — crew on site
- `Punchlist` — job done, minor items remain
- `Completed` — all work done, passed inspection
- `Invoiced` — final invoice sent
- `Paid` — payment received in full

**Lead Source Labels:**
- `Door Knock`
- `Storm Response`
- `Referral`
- `Angi / HomeAdvisor`
- `Google Organic`
- `Portal`
- `Repeat Customer`
- `Insurance Referral`

**Roof Type Labels:**
- `Flat / Low-Slope`
- `Gable`
- `Hip`
- `Mansard`
- `Shed`
- `Gambrel`

**Material Type Labels:**
- `Asphalt Shingle`
- `TPO`
- `EPDM`
- `Modified Bitumen`
- `Metal`
- `Slate`
- `Tile`

### Workflow and Action Vocabulary

Verbs used in roofing CRM — these become button labels, action menu items, and empty state messages:

- **Primary actions**: "Schedule Site Visit", "Send Estimate", "Mark Won", "Mark Lost", "Assign Rep", "Pull OPA Data", "Log Measurement"
- **Secondary actions**: "Request Permit", "Order Materials", "Schedule Crew", "Escalate to Manager", "Add Follow-Up", "Clone Deal", "Reopen"
- **CRM-specific**: "Advance Stage", "Stall Deal", "Reassign", "Merge Contacts"

### Sidebar Navigation Candidates

Domain-specific nav items for the roofing CRM sidebar — do NOT use generic labels:

1. **Deal Pipeline** (Kanban/list view of all open deals by stage)
2. **Lead Board** (unqualified inbound leads, pre-pipeline)
3. **Site Visits** (scheduled measurements calendar)
4. **Estimates** (sent proposals, status, follow-up queue)
5. **Properties** (address-level view, OPA data, roof history)
6. **Contacts** (homeowners and decision-makers)
7. **Crew Schedule** (production calendar, post-win)
8. **Reports** (pipeline metrics, rep performance, revenue)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Roofing contractor CRM software occupies a specific visual niche: **operational density meets field-team usability**. The practitioners who use these tools are sales reps checking their pipeline from a truck cab, estimators updating deals after a site visit, and office managers reviewing the weekly board on a desktop. The visual conventions they've internalized come from tools like AccuLynx, JobNimbus, and Pipedrive itself.

The dominant visual pattern is **status-forward**: every deal and job has a clear, color-coded status badge that communicates health at a glance. Stage columns (kanban) or stage indicator rows (list view) are the primary organizational structure. The color system is practical — green for progressing deals, amber for stalled/at-risk, red for overdue activities.

Design density sits at **standard-to-compact**: reps want to see 15-20 deals per screen without scrolling, but not so dense that the interface feels like a spreadsheet. The AccuLynx approach — clean white cards on a light gray background, bold status badges, clear typography hierarchy — represents the aesthetic expectation in this space. It reads as professional trade software, not consumer app, and not generic SaaS. Tables are preferred over cards for pipeline views; cards work for individual deal detail panels.

### Real-World Apps Clients Would Recognize as "Premium"

1. **AccuLynx** — The dominant roofing-specific CRM. White card layout, green/amber/red job status system, collapsible sidebar with job types as nav sections. Clients in this space would immediately recognize its visual language as "the good stuff." It's dense, functional, and organized around production workflows.

2. **Pipedrive** — The client IS using Pipedrive, so practitioners in this deal are already familiar with its Kanban pipeline, deal cards with value + stage labels, and activity log panels. A demo that feels like an enhanced Pipedrive (same information architecture, better visual polish) will feel instantly familiar and credible.

3. **JobNimbus** — Another roofing CRM with strong visual identity: color-coded boards, photo attachment workflows, and a mobile-forward design for field reps. Its card-based pipeline with avatar/rep photos on deals is recognizable to roofing sales teams.

### Aesthetic Validation

- **Job Analyst chose**: Linear/Minimal (to be confirmed from Creative Brief)
- **Domain validation**: Partially confirmed with adjustment. Roofing contractor CRM sits between Linear/Minimal and Corporate Enterprise. Practitioners use tools that are clean but dense — not the airy SaaS-Modern look. The aesthetic should lean toward **compact Linear**: precise grid, strong status badge system, standard spacing (not spacious), table-heavy views over card grids. A slight Pipedrive-inspired color palette (blue primary, white surfaces, neutral sidebar) would feel like "an upgrade of the tool they already use."
- **One adjustment**: Reduce spaciousness — this is not a wellness app. Use compact content-padding (1rem-1.25rem). Status badges should be prominent and color-saturated, not muted.

### Format Validation

- **Job Analyst chose**: dashboard-app (to be confirmed)
- **Domain validation**: Confirmed. This is unambiguously a CRM dashboard. The deliverable is a Pipedrive-integrated web app with pipeline views, deal management, and rep performance reporting. Dashboard-app format with collapsible sidebar is the correct architecture.
- **Format-specific design notes for Demo Screen Builder**: The main dashboard view should show the pipeline funnel (deals by stage), a KPI row at top (Open Pipeline $, Close Rate %, Deals This Month, Avg Deal Value), and a recent deals table. The Kanban view is a secondary feature page. Charts should favor bar charts for stage distribution, line/area for revenue trend over time.

### Density and Layout Expectations

**Standard-to-compact density**. Practitioners work in these tools all day. A rep might check the pipeline 10 times in a workday. Compact spacing (1rem content padding, 14rem-16rem sidebar) is appropriate — more than a trading terminal, less than a consumer app.

The domain strongly favors **table-heavy views** for the pipeline and deal lists. Cards work for individual deal detail (the right panel or modal when clicking a deal). The sidebar should group items logically (Sales → Production → Reports) and use domain vocabulary, not generic labels.

---

## Entity Names — Realistic Philadelphia Roofing

### Companies / Organizations (Roofing Contractors in Philadelphia)
1. Kensington Roofing & Exteriors
2. Roxborough Roofing Co.
3. Cardinal Restoration Group
4. Northeast Philly Roofers
5. Liberty Ridge Roofing
6. Delaware Valley Contracting
7. Fishtown Flat Roof Specialists
8. Manayunk Home Services
9. Schuylkill Ridge Roofing
10. Germantown Roofing Solutions
11. Greater Philly Roofing LLC
12. Cheltenham Exterior Services

### Homeowner / Contact Names (Philadelphia demographic mix)
1. Patricia Kowalski (Northeast Philly)
2. Darnell Washington (Germantown)
3. Rosa Mendez (Kensington)
4. Michael Farrelly (Roxborough)
5. Linda Chen (South Philly)
6. James Okafor (West Oak Lane)
7. Eileen Dougherty (Manayunk)
8. Robert Szymanski (Port Richmond)
9. Tyrone Barnes (Strawberry Mansion)
10. Colleen Murphy (Mt. Airy)
11. Victor Reyes (Hunting Park)
12. Agnes Petrowicz (Bridesburg)

### Sales Rep Names
1. Dave Castellano
2. Marcus Webb
3. Kristin Hanlon
4. Tony DiPietro
5. Shawn McAllister

### Philadelphia Streets / Addresses (realistic row home addresses)
- 2341 E Allegheny Ave, Philadelphia PA 19134 (Port Richmond)
- 4519 Frankford Ave, Philadelphia PA 19124 (Frankford)
- 743 N 5th St, Philadelphia PA 19123 (Northern Liberties)
- 1824 W Girard Ave, Philadelphia PA 19130 (Brewerytown)
- 6102 Germantown Ave, Philadelphia PA 19144 (Germantown)
- 3317 Kensington Ave, Philadelphia PA 19134 (Kensington)
- 427 Hermit St, Philadelphia PA 19128 (Roxborough)
- 512 Shawmont Ave, Philadelphia PA 19128 (Roxborough)
- 8834 Brous Ave, Philadelphia PA 19152 (Northeast Philly)
- 2108 Orthodox St, Philadelphia PA 19137 (Bridesburg)
- 4230 Manayunk Ave, Philadelphia PA 19128 (Manayunk)
- 1047 Mifflin St, Philadelphia PA 19148 (South Philly)

### OPA Account Number Format
- Format: 9-digit numeric (e.g., `123456700`, `391225400`, `562034100`)
- OPA data fields: Owner name, mailing address, land area (sqft), building area (sqft), market value, last sale date, last sale price, zoning classification

### Roof Material Types Used in Estimates
- "30-yr Architectural Shingles – GAF Timberline HDZ"
- "50-yr Architectural Shingles – GAF Camelot II"
- "TPO Membrane – 60 mil single-ply"
- "EPDM Rubber – 60 mil fully adhered"
- "Modified Bitumen – SBS granulated cap sheet"
- "Standing Seam Metal – Galvalume 26 gauge"
- "3-Tab Asphalt – Standard economy grade"
- "Slate – Pennsylvania Blue-Gray natural"

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Residential deal value (replacement) | $6,800 | $14,200 | $32,000 | Row homes smaller than suburban; flat roof cheaper than shingle |
| Flat roof replacement (EPDM/TPO) | $4,500 | $9,800 | $18,000 | Philly row homes 800-1,600 sqft typically |
| Roof size — residential row home | 8 squares | 14 squares | 22 squares | 800-2,200 sqft; multiply by pitch factor for actual material |
| Roof size — twin/semi-detached | 18 squares | 26 squares | 38 squares | Larger lot, usually gable or hip |
| Roof size — detached residential | 25 squares | 35 squares | 55 squares | Suburban Philly, Roxborough, NE Philly |
| Price per square — asphalt shingle | $450/sq | $620/sq | $850/sq | Includes labor + material + underlayment |
| Price per square — flat TPO | $500/sq | $680/sq | $950/sq | Fully adhered, warranty included |
| Price per square — EPDM | $450/sq | $600/sq | $820/sq | Ballasted or fully adhered |
| Client rate (job posting) | — | $6.33/sqft ($633/sq) | — | Standard rate referenced in job post |
| Close rate | 18% | 31% | 48% | 30-40% is industry "good"; 46%+ for high-follow-up teams |
| Sales cycle length | 3 days | 18 days | 60 days | Insurance claims extend to 60-90 days |
| Days from Lead to Site Visit | 1 day | 4 days | 14 days | Storm season compresses timelines |
| Days from Site Visit to Estimate Sent | 0 days | 2 days | 7 days | Good reps same-day or next-day |
| Days from Estimate to Won/Lost | 2 days | 12 days | 45 days | Negotiating phase most variable |
| Gross margin % | 28% | 38% | 52% | Materials 30-40% of job cost |
| Deals in pipeline (active) | 8 | 22 | 65 | Varies by crew count and season |
| Leads per month | 12 | 35 | 90 | Storm season spikes dramatically |
| Revenue per month | $28,000 | $95,000 | $320,000 | Seasonal; spring/fall peak |
| Repeat customer rate | 8% | 18% | 35% | Roofs last 20+ years; referrals more common than repeats |

---

## Industry Terminology Glossary

| Term | Definition | Usage Context |
|------|-----------|---------------|
| Square | 100 square feet of roofing area; the standard unit of measure for pricing | "This job is 22 squares of TPO" |
| Pitch | The slope of a roof expressed as rise/run (e.g., 4/12 = 4" rise per 12" run) | Affects labor cost; steep pitch = higher cost |
| Pitch multiplier | Factor applied to plan area to get actual roof area (e.g., 6/12 pitch = 1.118x) | Used in takeoff calculations |
| Waste factor | Additional material ordered beyond calculated need; 10% simple, 15-20% complex | Accounts for cuts, overlaps, valleys |
| Takeoff | The process of measuring a roof from plans or satellite imagery to calculate material quantities | "I did the takeoff on the Allegheny Ave job" |
| Flat roof / Low-slope | Roof with pitch less than 2/12; requires different membrane materials than steep-slope | Dominant in Philadelphia row homes |
| EPDM | Ethylene Propylene Diene Monomer; rubber membrane for flat roofs; 20-30yr lifespan | Most common Philly row home flat roof material |
| TPO | Thermoplastic Polyolefin; white single-ply flat roof membrane; energy-efficient | Growing popularity, white = cool roof rebates |
| Modified Bitumen | Asphalt-based flat roof membrane; torch-applied or self-adhered | Older Philly buildings; peel-and-stick variant common |
| Drip edge | Metal flashing installed at eaves and rakes; directs water off roof edge | Required by code in PA; common line item on estimates |
| Ice & Water Shield | Peel-and-stick waterproofing underlayment; applied at eaves, valleys, penetrations | Required in PA at first 24" from eave |
| Deck inspection | Visual check of plywood/OSB sheathing for soft spots, rot after tear-off | Decking replacement = unexpected upsell |
| Tear-off | Removal of existing roofing material before new installation | "Full tear-off and replacement" vs. "overlay" |
| Overlay / Recovery | Installing new material over existing without tear-off | Code-limited; most jurisdictions allow 2 layers max |
| OPA number | Office of Property Assessment account number (Philadelphia) | Used to look up property data from atlas.phila.gov |
| L&I | Licenses & Inspections; Philadelphia city department that issues roofing permits | "L&I permit" on every job over $5,000 |
| EZ Re-Roofing Permit | Streamlined Philadelphia permit for like-for-like roof replacements | Faster than full building permit; ~5-10 business days |
| Insurance adjuster | Insurance company representative who inspects storm damage claims | Getting adjuster approval = insurance job moves forward |
| Supplement | Additional items added to an insurance claim after initial approval | Common when adjuster missed line items |
| ACV vs. RCV | Actual Cash Value vs. Replacement Cost Value insurance payout types | RCV pays full replacement; ACV deducts depreciation |
| Storm chaser | Sales rep who canvasses neighborhoods after hail/wind storm events | High volume, lower margin deals typically |
| Door knock | In-person canvassing; rep knocks doors in target neighborhood | Primary lead gen method for many Philly roofers |
| Canvassing | Systematic door-to-door or neighborhood marketing effort | Often done with territory map and CRM integration |
| Flashing | Metal pieces used to seal roof penetrations and transitions (chimneys, vents, skylights) | Common upsell/repair line item |
| Ridge cap | Specialized shingles or metal trim applied along the roof peak | Included in standard replacement |
| Decking | Plywood or OSB substrate beneath roofing material | Replace if soft, wet, or damaged |
| Three-tab | Economy asphalt shingle with flat, uniform appearance; largely replaced by architectural | Less common now; budget jobs |
| Architectural / Dimensional | Premium asphalt shingle with textured, multi-layer appearance | Standard for residential replacement |

---

## Common Workflows

### Workflow 1: Residential Lead to Contract (Standard)
1. **Lead in** — Inbound via Angi/HomeAdvisor portal, referral call, door knock, or storm response canvassing. Rep logs to Pipedrive as new deal with address and homeowner name.
2. **Contacted** — Rep calls homeowner within 24 hours, explains services, qualifies interest. Updates deal with contact notes.
3. **Site Visit Scheduled** — Rep books appointment. Pipedrive activity logged. CRM can pull OPA data from atlas.phila.gov to pre-populate property size and owner address.
4. **Measured** — Rep visits property, walks roof (ladder or drone), takes photos, logs measurements in squares. Notes pitch, materials, flashing condition. Deal updated with roof size, complexity rating.
5. **Estimate Sent** — Rep generates estimate from measurement data. Line items: tear-off, material (brand/grade), labor, flashing, drip edge, permit fee. Sent via email as PDF proposal. Deal value entered in Pipedrive.
6. **Negotiating** — Homeowner reviews, asks questions, may request alternative materials or pricing. Rep follows up by day 3. May offer minor discount or added warranty to close.
7. **Won** — Homeowner signs contract, pays deposit (typically 10-30%). Pipedrive deal marked Won. Job created in production system.
8. **Permit filed** — L&I permit application submitted (EZ Re-Roofing for standard residential).
9. **Scheduled** — Crew date set with homeowner. Materials ordered from supplier.
10. **Completed & Invoiced** — Job done, final walkthrough, balance invoice sent. Payment collected.

### Workflow 2: Insurance Claim Deal
1. Rep identifies storm-affected area from hail maps or after storm event. Door-knocks neighborhood.
2. Homeowner agrees to free inspection. Rep identifies damage consistent with storm event.
3. Rep advises homeowner to file insurance claim. Rep files report in Pipedrive noting "Insurance Claim" status.
4. Insurance adjuster schedules inspection (7-21 days wait typical).
5. Rep meets adjuster on site ("adjuster appointment") to advocate for full scope. Goal: get ACV or RCV approval.
6. Adjuster approves claim. Approval letter shared with rep. Deal moves to Estimate stage.
7. Rep creates estimate from approved claim amount. May supplement for missed items.
8. Homeowner signs contract using insurance proceeds. Deposit = insurance deductible.
9. Supplement negotiations with adjuster for additional line items (flashing, decking, etc.).
10. Job scheduled and completed. Final payment from insurance upon job completion documentation.
11. Sales cycle: 30-90 days total (vs. 7-21 days for standard deal).

### Workflow 3: OPA Data Pull (Philadelphia-Specific)
1. Rep enters property address into deal form.
2. App queries atlas.phila.gov / OPA API with address.
3. Returns: owner name, mailing address (useful if rental), OPA account #, land area sqft, building area sqft, last sale price, zoning.
4. Rep compares OPA building area to estimated roof size — rough validation of measurement.
5. Owner name used to pre-fill contact in Pipedrive if it differs from person who answered door (common with rentals).
6. OPA data stored as custom field on Pipedrive deal.

---

## Common Edge Cases

1. **Rental property / absentee owner** — Person who answered door is tenant, not owner. OPA lookup reveals different owner with out-of-state mailing address. Deal requires owner contact before progressing.
2. **HOA restriction** — Property in planned community with HOA approval required for exterior changes. Adds 2-4 week delay and possible material constraint (color/brand specified by HOA).
3. **Decking damage discovered at tear-off** — Unexpected rotted sheathing adds cost mid-job. Contract has a per-sheet addendum clause; homeowner must approve verbally before crew continues.
4. **Insurance partial approval / underpayment** — Adjuster approves lower amount than estimate. Rep must negotiate supplement or homeowner must pay the difference. Deal stalls in Negotiating.
5. **Permit delay** — Philadelphia L&I permit backlog can be 2-4 weeks during peak season. Job scheduled but crew can't start until permit issued. Deal sits in "Pending Permit" for extended time.
6. **Multi-section roof** — Property has flat section (front/back) AND sloped main roof. Two separate material types, two pricing calculations. Estimate more complex; common in older Philly twins.
7. **Storm chaser competition** — After storm event, homeowner is getting quotes from 4-6 contractors simultaneously. Rep needs same-day follow-up or loses deal. High-urgency activity flag in CRM.
8. **Soft deck / full tear-and-rebuild** — Extensive deck rot requires structural work beyond standard roofing scope. Needs separate permit category; higher margin but more complex scheduling.
9. **Measurement error** — Rep's manual measurement differs from satellite takeoff by >10%. Catch before sending estimate or cost overrun occurs.
10. **Cash deal / no permit** — Homeowner requests work without permit to avoid assessment impact. Contractor faces liability. Flag as compliance risk in CRM.

---

## What Would Impress a Domain Expert

1. **"Squares" as the primary unit** — A demo that shows "22.5 sq" instead of "2,250 sqft" in the estimate line items signals immediate industry fluency. Residential flat roofs in Philly are 8-18 squares; bigger jobs are 25-40 squares. Using this unit with correct decimal precision (not just whole numbers) shows real knowledge.

2. **OPA data integration detail** — Knowing that atlas.phila.gov provides OPA account numbers, building area, and last sale date — and showing this as a "Pull Property Data" feature that pre-fills deal fields — is a hyper-local, Philadelphia-specific detail that no generic template would include. Showing the OPA number format (9 digits) and fields it returns is the kind of specificity that makes a Philly contractor think "this dev actually researched how we work."

3. **Insurance claim workflow distinction** — Separating standard deals from insurance claim deals in the pipeline is standard practice for storm-season roofers but absent from generic CRM demos. Showing "Awaiting Adjuster Approval" as a real pipeline stage (or substage) with appropriate timing expectations (21-45 days) signals deep workflow knowledge.

4. **L&I permit tracking** — Philadelphia's Department of Licenses and Inspections ("L&I") and their EZ Re-Roofing permit process is hyper-local. Any demo that includes a "Permit #" field, "EZ Permit" status, or L&I status tracker in the production view signals someone did actual research on Philadelphia construction requirements.

5. **Lead source split with storm/canvassing distinction** — Roofing businesses obsessively track whether leads came from storm-response canvassing vs. organic/referral because the sales cycle, close rate, and margin profile differ significantly. A KPI that breaks down lead source by "Door Knock," "Storm Response," "Angi/Portal," and "Referral" — with different expected close rates shown — signals industry expertise instantly.

---

## Common Systems & Tools Used

| Tool | Category | Notes |
|---|---|---|
| Pipedrive | CRM / Deal Pipeline | The client uses this; Zapier integrations common |
| AccuLynx | Roofing-Specific CRM | Industry reference; field app + desktop dashboard |
| JobNimbus | Roofing CRM alternative | Popular with storm-chasers; mobile-first |
| EagleView / Roofr | Aerial measurement / satellite takeoff | Orders satellite measurement reports by address |
| iRoofing | Estimate calculator | Mobile app used on site visits |
| Hover | 3D measurement app | Photo-based roof measurement technology |
| CompanyCam | Photo documentation | Field photos organized by job/deal |
| QuickBooks | Accounting | Invoice, payment, and expense tracking |
| atlas.phila.gov | Philadelphia property data | OPA lookup, permit search, zoning |
| OpenDataPhilly | Property/assessment data | Dataset downloads, API access |
| Google Sheets / Excel | Estimating | Many smaller contractors still use spreadsheets |
| Zapier | Automation | Connects Pipedrive to Gmail, Google Sheets, Slack |

---

## Geographic / Cultural Considerations

**Philadelphia-Specific:**
- **Row homes dominate** — The majority of Philly residential stock is attached row homes, typically 1,000-1,600 sqft with flat or low-slope roofs. This is the core market for a Philly roofing contractor.
- **ZIP codes in mock data** — Use real Philadelphia ZIP codes:
  - 19125 (Fishtown), 19134 (Port Richmond/Kensington), 19123 (Northern Liberties), 19144 (Germantown), 19128 (Roxborough/Manayunk), 19152 (Northeast Philly), 19137 (Bridesburg), 19130 (Brewerytown), 19148 (South Philly)
- **L&I jurisdiction** — All permits through Philadelphia Department of Licenses & Inspections; no county-level variation within the city
- **Seasonal patterns** — Spring (March-May) and Fall (Sept-Oct) are peak seasons. Summer heat slows deals. Winter (Dec-Feb) is low season with focus on emergency repairs and pipeline-building. Hail/wind storm events (April-September) create sudden demand spikes.
- **Measurement system** — Imperial (squares, linear feet, squares of shingles per bundle). Pricing in USD per square.
- **OPA number format** — 9-digit numeric format, no dashes. Examples: `391225905`, `562034100`, `243050400` (real Philly OPA format from open data)
- **Property assessment context** — Philadelphia does triennial property reassessments. Homeowners are sensitive about roof work affecting their assessment — relevant to permit/no-permit edge case.

---

## Data Architect Notes

**Entity naming:**
- Use "deals" as the primary dataset (not "projects" or "jobs")
- Use "contacts" for homeowners (Pipedrive terminology)
- Use "activities" for logged calls, visits, notes (Pipedrive native)
- Production/job records post-win can be "jobs" dataset

**Key field values:**
- `roofSize`: decimal squares (e.g., 14.5, 22.0, 8.5, 31.0) — NOT sqft
- `estimateValue`: $6,800 to $32,000 range residential; use $6.33/sqft rate for calculations where size × 100 × 6.33 gets you per-sqft pricing
- `materialType`: use exact strings from Status Labels section above
- `roofType`: use exact strings ("Flat / Low-Slope", "Gable", "Hip")
- `leadSource`: use exact strings from Lead Source Labels above
- `pipelineStage`: use exact stage names from Status Labels (Pipedrive-style)
- `opaNumber`: 9-digit numeric string (e.g., "391225905")
- `zipCode`: use real Philadelphia ZIP codes from geographic section
- `repName`: use names from Sales Rep Names list
- `daysInStage`: integer, 0-90 range; deals in Negotiating often 7-21

**Edge cases to include as specific records:**
- 1-2 deals stalled in "Negotiating" for 30+ days (high days-in-stage)
- 1 deal tagged "Insurance Claim" with adjuster appointment pending
- 1 deal with absentee/rental owner (OPA owner differs from contact)
- 1 job with permit status "Pending Permit" (blocked crew schedule)
- 1 deal "Won" but not yet invoiced (production in progress)
- 1 very high-value outlier deal ($28,000+) on a detached residential
- 1 deal marked "Lost" to competitor after extended negotiation
- At least 2 deals with "Storm Response" lead source (showing seasonal spike)

**Date patterns:**
- Deals spread across last 90 days; cluster more in spring/fall
- Won deals from 30-60 days ago now in production stages
- Activities (calls, site visits) dated 1-21 days ago
- Chart time-series: 12 months of monthly deal count + revenue, showing seasonal peaks in March-May and September-October

---

## Layout Builder Notes

- **Density**: Standard-to-compact. Use `--content-padding: 1rem` or `1.25rem`. Practitioners use this tool operationally — not a marketing page.
- **Sidebar width**: 16rem standard is fine. Nav labels are all short enough; no need for 18rem.
- **Color nuance**: Pipedrive's own UI uses a blue primary (#457AFF range) with white surfaces and a mid-gray sidebar. This aesthetic is deeply familiar to anyone who uses Pipedrive. An analogous but differentiated blue (steel blue, navy, or muted cobalt) maintains domain familiarity without being a clone.
- **Status badges are critical** — In this domain, badges must be visually prominent. Use filled/solid badges for stage labels, not just outlined. Green for Won/progressing, amber for Stalled/Negotiating, red for Lost/overdue, blue for active pipeline stages.
- **Table-first layout** — The pipeline view should default to list/table, not kanban. Kanban is a secondary view. Reps scanning 20-40 deals need tabular density.
- **Icons**: Lucide icons that work well — `Home` (for Properties), `Calendar` (Site Visits), `FileText` (Estimates), `Users` (Contacts), `BarChart2` (Reports), `Layers` (Deal Pipeline), `ClipboardList` (Lead Board)

---

## Demo Screen Builder Notes

- **Hero metric (largest stat card)**: "Open Pipeline Value" in dollars ($247,500 example range) — this is what the business owner checks first every morning
- **Second most important**: "Close Rate" as a percentage with trend arrow (up/down vs. last month)
- **Third**: "Active Deals" count with breakdown by stage on hover
- **Fourth**: "Avg Deal Value" in dollars
- **Primary chart**: Area chart or bar chart showing "Revenue Won by Month" over last 12 months — with seasonal peaks visible in spring/fall; this is the chart every roofing owner wants to see
- **Secondary chart**: Stacked bar or donut chart showing "Deals by Stage" (pipeline distribution) — shows pipeline health at a glance
- **Domain-specific panel that would impress**: "Recent Activity Feed" showing deal stage advances, measurements logged, estimates sent — like AccuLynx's rolling activity log. Include rep names and deal addresses. e.g., "Dave Castellano advanced 4519 Frankford Ave to Estimate Sent · 2h ago"
- **Table below charts**: Recent deals table with columns: Address, Homeowner, Stage, Rep, Value ($), Roof Size (sq), Lead Source, Days in Stage — using all domain-specific column names
- **No generic charts**: Do NOT do a generic "Users by Month" or "Revenue by Category" chart. Use roofing-specific data (deals by material type, close rate by lead source, revenue by rep)
- **For dashboard-app format**: KPI row (4 cards) → Revenue trend chart (left) + Pipeline distribution chart (right) → Activity feed (left) + Recent deals table (right). This matches AccuLynx's dashboard pattern and will feel immediately familiar.
