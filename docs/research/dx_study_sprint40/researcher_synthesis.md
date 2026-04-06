---
name: Experience Researcher Synthesis
type: research
sprint: 40
---

# Experience Researcher Synthesis — Sprint 40 DX Usability Study

## Study Overview
- **Participants:** 3 developer personas (junior, mid-level, senior/staff)
- **Framework Studied:** LightSpec/AutoSpec SDD Framework
- **Study Date:** 2026-04-05
- **Method:** Simulated think-aloud usability testing + friction log analysis + structured interviews

---

## Affinity Map

### Category 1: Onboarding Path Fragmentation
The first-touch experience — finding install instructions, choosing the right tool, and understanding the relationship between LightSpec and AutoSpec — is disorganized across all three personas. Each arrived at a different document first and experienced a different version of the same confusion.

**Issues from Alex:** No `npm install` command in QUICKSTART.md or any assigned doc. QUICKSTART.md opens with AutoSpec workflow instructions (`{{INPUT_FOLDER}}` templates, 9-role generation) with no LightSpec entry point. The VS Code + Copilot environment listed as supported does not work with `lsp init`. The two frameworks (AutoSpec, LightSpec) share terminology (specs, backlog) but have incompatible workflows with no disambiguation.

**Issues from Sam:** Package name (`lightspec`) and binary name (`lsp`) diverge without obvious explanation. QUICKSTART.md is written for AutoSpec and does not describe the `lsp` CLI commands at all. The `--dry-run` flag for `lsp init` exists in source but is not mentioned in any quickstart or onboarding doc.

**Issues from Jordan:** `--yes` / `-y` flag for non-interactive mode is undocumented in onboarding guides. The `--force` flag appears in `steps-en.ts` as `lsp init --depth=full --force` but does not exist in `init.ts`. Provider auto-resolution behavior (which provider got picked and why) is not surfaced before the confirmation prompt.

**Pattern:** The onboarding layer is implicitly designed for someone who already knows which tool they need and how to set up an LLM provider. Every persona — junior, mid-level, senior — had to resolve ambiguity that should not exist at the entry point. The fragmentation is not a documentation volume problem; it is a structural problem. There is no single authoritative "start here" artifact for LightSpec.

---

### Category 2: LLM Provider Setup — A Hidden Prerequisite
All three personas encountered the provider resolution dependency at different severity levels, but it appeared in every report. The tool implies zero-config behavior ("LightSpec resolves the LLM provider automatically") while silently requiring credentials that most developers — especially juniors and team leads using Copilot or Cursor — do not have pre-configured.

**Issues from Alex:** `lsp init` requires Claude Code, Anthropic API key, or Gemini API key. Alex uses GitHub Copilot. QUICKSTART.md lists `vscode-copilot` as a supported environment but Copilot cannot fulfill the LLM requirement for `lsp init`. The error message "No LLM provider available" gives no actionable recovery path (no link, no command to run, no cost context). Alex would hit this as a complete blocker before seeing any generated output.

**Issues from Sam:** Provider confirmation ("Using provider: claude-code") is printed only after the user says Y to the generation prompt — too late to choose a different provider. No documentation on OpenAI model equivalents when using `--provider openai`, making the FinOps model selection framework (haiku/sonnet/opus tiering) inaccessible to non-Claude users.

**Issues from Jordan:** Error exit is `process.exit(1)` with no meaningful distinction between "no provider configured" and "provider configured but generation failed." In CI contexts, `readline.createInterface` blocks indefinitely without `--yes` flag — a hang, not an error. `lsp scan --json` exits 0 even on partial failure (empty arrays without error indication).

**Pattern:** Provider configuration is the single largest first-run blocker across all experience levels. The framework's "zero config" narrative creates false expectations. Junior developers need a provider setup guide with cost context. Team leads need model equivalency tables. CI engineers need documented exit codes and non-interactive mode documentation.

---

### Category 3: The LSS-to-Skill-Layer Gap
The most structurally significant UX problem in the framework is that the two halves — the LSS pipeline (`lsp init` → `.lsp/tasks.md`) and the AutoSpec skill layer (`/execute-ticket` → `specs/backlog.md`) — do not connect without an explicit graduation step that is framed as a future milestone, not an immediate prerequisite.

**Issues from Alex:** Not directly encountered (Alex did not attempt to use the skill layer), but the graduation disconnect was visible: `lsp graduate` for a micro project produces 5 nearly empty stub files. The graduation framing ("when ready") does not specify readiness criteria, leaving Alex uncertain whether to graduate immediately or never.

**Issues from Sam:** `/execute-ticket` reads `specs/backlog.md`. Alex's project only has `.lsp/tasks.md`. The skill errors silently or uses empty context. Sam manually reformatted tasks into a `backlog.md` to bridge the gap — "maybe 10 minutes of work, but it's a surprising gap given how clean the rest of the pipeline is." No documentation says "you must graduate (or manually create `specs/backlog.md`) before using `/execute-ticket`." The `/sprint-run` skill has viewer dependency phases (updates `viewer/src/data/sprints.ts`) that fail or require manual skipping for projects that do not have the AutoSpec viewer app.

**Issues from Jordan:** Not a primary friction point (Jordan used the LSS layer in isolation by design), but Jordan noted the viewer dependency in `sprint-run` as a structural problem: the skill assumes an artifact (the viewer React app) that does not exist in a new project. The `lsp graduate` heading extraction fragility compounds the gap — even if graduation is attempted, section mismatches produce stub output that is no better than not graduating.

**Pattern:** The framework's adoption funnel has a critical gap between its lightweight entry tool and its primary value delivery mechanism (the skill layer). Users who follow the natural progression — scan, init, build, try skills — hit a wall at the skill-layer boundary. The gap is not documented, the workaround is not documented, and the bridge command does not exist.

---

### Category 4: Scanner Capability Gaps and Silent Overconfidence
The scanner is the framework's most technically impressive component and also the source of its most consequential trust problem. The scan output presents results with uniform confidence regardless of what it actually detected or missed. Three distinct failure modes appeared across the reports.

**Issues from Alex:** Architecture reported as "unknown" for a flat `src/` structure with no `src/modules/` or `apps/` pattern. Expected format for `lsp status` task completion (`[x] done` vs. `[x]`) contradicts the actual parser behavior — minor but symptomatic of scan-to-output inconsistency.

**Issues from Sam:** Empty `db/` directory not detected as a database signal — the scanner only detects actual Prisma/migration artifacts, not intent. Routes may be incomplete when they use dynamic registration (common in Fastify with decorators), but the scan output does not surface this as a low-confidence result. Scanner prints what it found, never what it failed to find.

**Issues from Jordan:** Go route extraction is documented in `docs/lss/03_scanner.md` (Gin/Echo/Fiber/Chi with regex examples) but is not implemented in `detect-routes.ts`. No `.go` glob exists in the route scanning section. For FleetPulse, this means the entire Go backend API surface is invisible to the scanner. `hasApi: false` is produced for a project whose primary purpose is HTTP API serving, because the Go backend lives in `backend/` rather than a directory name in the `apiDirSignals` list. Line count uses a `~50 bytes/line` heuristic on the first 200 files (alphabetical order), reporting precise-looking numbers ("approximately 6,805 lines") from a rough sampling strategy.

**Pattern:** The scanner's confidence presentation does not match its detection confidence. The "Scan complete ✓" signal is identical whether the scanner found everything or almost nothing. For the Node.js/TypeScript target audience, this is a minor issue. For any team with a Go, Rust, or Ruby backend, this is a fundamental trust problem — the tool describes its own limitations inaccurately.

---

### Category 5: Graduate Output Quality — Stubs and Fragility
The `lsp graduate` command is the bridge between LightSpec and AutoSpec. All three personas evaluated it and all three found meaningful quality problems — though they located the problems in different layers.

**Issues from Alex:** For a CLI project with no frontend and no database, `lsp graduate` produces `03_frontend_lead.md` with only `"_See .lsp/spec.md for frontend details._"` and similar empty stubs. Five of ten role spec files are generated but inapplicable. `lsp graduate` overwrites `CLAUDE.md` without a warning prompt. The generated CLAUDE.md contains a literal `[Project Name]` placeholder rather than the actual project name.

**Issues from Sam:** Roles 06-10 are stubs with "TODO: run autospec generate" comments. For a real project, the DevOps spec (role 06) is "critical for our deployment setup but essentially empty." The graduated `backlog.md` is missing model assignment columns and points estimates that the skill layer (`sprint-status` FinOps metrics) needs — requiring additional manual formatting before skills work. The graduation docs lack a worked example showing before/after state.

**Issues from Jordan:** Heading-based section extraction in `extractSection()` is fragile — LLM-generated headings like "Architecture & API Design" or "Service Layer Design" do not match the expected patterns ("Technical Design", "Architecture"), falling through to placeholder stubs. There are no tests for extraction against LLM-generated heading variations. The AutoSpec role numbering in `graduate.ts` (06=DevOps, 07=Security, 08=Data Engineer, 09=Tech Writer, 10=PM) does not match either the 9-role model (methodology docs) or the 10-role model (ground truth schema) — a version drift signal. No `--dry-run` mode on `graduate` to preview extraction results before writing files.

**Pattern:** `lsp graduate` presents itself as an upgrade path, but the current implementation has four independent failure modes: inapplicable role stubs for simple projects, CLAUDE.md overwrite without confirmation, heading extraction fragility against LLM output variance, and role schema inconsistency across versions. A user who follows the recommended graduation path will encounter at least one of these, and the output will look superficially complete (10 files written) while being substantively incomplete.

---

### Category 6: Task Management UX and Progress Tracking
The daily interaction loop — marking tasks done, checking status, managing progress — surfaces as low-to-medium severity friction across all personas but represents a chronic daily cost that compounds over time.

**Issues from Alex:** No `lsp done <id>` command — marking a task done requires opening `.lsp/tasks.md`, finding the correct markdown table row, and editing the status cell. If the table formatting is off by one pipe character, the regex parser in `status.ts` silently drops the task. Running `lsp status` from a subdirectory fails silently with "No LightSpec output found" rather than explaining the working directory requirement.

**Issues from Sam:** `lsp status` requires `.lsp/tasks.md` to exist; running it before `lsp init` produces a file-not-found crash rather than a helpful "run lsp init first" message. No automated way to detect or repair drift between `backlog.md` state and reality when multiple developers are working simultaneously.

**Issues from Jordan:** No `lsp status --tasks <path>` flag to point at a custom tasks file. Running `lsp graduate` from a subdirectory (when `.lsp/` is in a parent or sibling directory) fails because it hardcodes `process.cwd()` with no `--dir` flag.

**Pattern:** The task management layer is designed around a single-developer, single-directory, manual-edit workflow. The lack of a `lsp done <id>` command is the most universally noted gap (Alex and Jordan noted it explicitly; Sam implied it in the concurrent-access concern). The silent failures on path mismatches affect all personas at different severity levels.

---

### Category 7: Team and Collaborative Workflows — Unaddressed
The framework's documentation models two extremes: a solo developer using Claude Code, and an AI-orchestrated agent fleet running in parallel. The 2-5 person hybrid team — the most likely early adopter profile — appears nowhere in the documentation.

**Issues from Alex:** Not directly relevant (solo project), but Alex noted the methodology docs feel like "the wrong room" — written for teams and complexity levels that don't match a solo junior dev.

**Issues from Sam:** No guidance on human + AI parallel work. No conflict model for concurrent `backlog.md` writes when two humans each run `/execute-ticket` simultaneously. No Jira/Linear/GitHub Issues integration story — the `backlog.md` as single source of truth requires stakeholders to abandon their existing tracker or maintain two systems. The multi-agent pattern assumes AI agents as parallel workers; human developers working alongside agents is not modeled.

**Issues from Jordan:** The `Depends` column is missing from the backlog format — a gap that matters for any team where ticket ordering has dependency constraints. The `plan-sprint` skill's six-phase planning workflow (4 parallel expert agents + 3 sequential PM passes) is optimized for larger teams and adds ceremony overhead disproportionate to a 2-person team's planning needs.

**Pattern:** Team adoption blockers are structural, not cosmetic. The framework would need a documented hybrid human+AI workflow model, a lightweight integration story with existing trackers, and concurrent access handling before a 2-5 person team could adopt it without significant custom process design.

---

## Issue Frequency Table

| Issue | Alex (Junior) | Sam (Mid) | Jordan (Senior) | Total Personas | Avg Severity |
|-------|--------------|-----------|-----------------|----------------|--------------|
| No install instructions in primary docs | ✓ (sev 5) | ✓ (sev 2) | — | 2/3 | 3.5 |
| LLM provider setup not documented / blocks first run | ✓ (sev 5) | ✓ (sev 2) | ✓ (sev 2) | 3/3 | 3.0 |
| AutoSpec vs LightSpec not disambiguated at entry point | ✓ (sev 4) | ✓ (sev 3) | — | 2/3 | 3.5 |
| LSS tasks.md → skills backlog.md gap (no bridge) | — | ✓ (sev 4) | ✓ (sev 3) | 2/3 | 3.5 |
| Go route extraction documented but not implemented | — | — | ✓ (sev 4) | 1/3 | 4.0 |
| hasApi detection unreliable for non-conventional structures | — | ✓ (sev 3) | ✓ (sev 4) | 2/3 | 3.5 |
| `lsp graduate` produces inapplicable stubs for simple/polyglot projects | ✓ (sev 3) | ✓ (sev 3) | ✓ (sev 3) | 3/3 | 3.0 |
| Graduate heading extraction is fragile against LLM output variation | — | — | ✓ (sev 3) | 1/3 | 3.0 |
| CLAUDE.md generated with unfilled `[Project Name]` placeholder | ✓ (sev implicit) | ✓ (sev 2) | ✓ (sev 2) | 3/3 | 2.0 |
| No `lsp done <id>` command — manual markdown editing required | ✓ (sev 2) | — | ✓ (sev 2) | 2/3 | 2.0 |
| `lsp status` fails silently on wrong working directory | ✓ (sev 3) | ✓ (sev 2) | ✓ (sev 2) | 3/3 | 2.3 |
| scanner output presents all results with equal confidence (no low-confidence flags) | — | ✓ (sev 3) | ✓ (sev 4) | 2/3 | 3.5 |
| `--force` flag mentioned in guide but not implemented in init.ts | — | ✓ (sev 2) | ✓ (sev 3) | 2/3 | 2.5 |
| `--dry-run` flag undocumented in quickstart / onboarding | ✓ (sev 2) | ✓ (sev 2) | — | 2/3 | 2.0 |
| No team workflow guide (2-5 person hybrid human+AI) | — | ✓ (sev 4) | ✓ (sev 3) | 2/3 | 3.5 |
| sprint-run skill viewer dependency (viewer may not exist) | — | ✓ (sev 3) | — | 1/3 | 3.0 |
| No monorepo-specific workflow documentation | — | ✓ (sev 3) | ✓ (sev 2) | 2/3 | 2.5 |
| Methodology docs labeled AutoSpec but not clearly distinguished from LightSpec docs | ✓ (sev 3) | — | — | 1/3 | 3.0 |
| AutoSpec role count inconsistency (9-role vs 10-role across docs) | — | — | ✓ (sev 2) | 1/3 | 2.0 |
| `lsp graduate` overwrites CLAUDE.md without warning | ✓ (sev 3) | — | ✓ (sev 2) | 2/3 | 2.5 |
| No incremental spec update (regeneration is all-or-nothing) | — | ✓ (sev 3) | ✓ (sev 3) | 2/3 | 3.0 |
| No Jira/Linear/GitHub Issues integration story | — | ✓ (sev 4) | — | 1/3 | 4.0 |
| Confirmation prompt fires before provider is resolved | — | ✓ (sev 2) | — | 1/3 | 2.0 |

---

## Severity-Weighted Ranking

Formula: `(frequency/3) × avg_severity`

| Rank | Issue | Frequency | Avg Severity | Weighted Score | Category |
|------|-------|-----------|-------------|----------------|----------|
| 1 | LLM provider setup not documented / blocks first run | 3/3 | 3.0 | 3.00 | Provider Setup |
| 2 | `lsp graduate` produces inapplicable stubs for simple/polyglot projects | 3/3 | 3.0 | 3.00 | Graduate Output |
| 3 | `lsp status` fails silently on wrong working directory | 3/3 | 2.3 | 2.30 | Task Management |
| 4 | CLAUDE.md generated with unfilled `[Project Name]` placeholder | 3/3 | 2.0 | 2.00 | Graduate Output |
| 5 | No install instructions in primary docs | 2/3 | 3.5 | 2.33 | Onboarding |
| 6 | AutoSpec vs LightSpec not disambiguated at entry point | 2/3 | 3.5 | 2.33 | Onboarding |
| 7 | LSS tasks.md → skills backlog.md gap (no bridge) | 2/3 | 3.5 | 2.33 | LSS-Skill Gap |
| 8 | hasApi detection unreliable for non-conventional structures | 2/3 | 3.5 | 2.33 | Scanner Accuracy |
| 9 | Scanner output presents all results with equal confidence (no low-confidence flags) | 2/3 | 3.5 | 2.33 | Scanner Accuracy |
| 10 | No team workflow guide (2-5 person hybrid human+AI) | 2/3 | 3.5 | 2.33 | Team Workflow |
| 11 | No `lsp done <id>` command — manual markdown editing required | 2/3 | 2.0 | 1.33 | Task Management |
| 12 | Go route extraction documented but not implemented | 1/3 | 4.0 | 1.33 | Scanner Accuracy |

---

## Verbatim Quote Bank

### From Alex (Junior Developer)

> "The QUICKSTART.md gets very long. I'm talking hundreds of lines of content that feels like it's for the AI to read, not for me. I got lost around line 200. I didn't know if I was supposed to read all of this or just copy-paste it somewhere." — Context: First read of QUICKSTART.md, looking for install instructions

> "I use GitHub Copilot, not Claude. Do I need to switch? There's an environments table listing vscode-copilot, which gave me some hope, but then most of the example commands below use Claude Code syntax." — Context: Encountering the AI environment section of QUICKSTART.md

> "Reading about 9-role models, sprint orchestration with parallel AI agents, and 'Agent A (Backend Window)' / 'Agent B (Frontend Window)' made me feel like I was in the wrong room. None of this mapped onto my situation as a solo dev with a CSV parser." — Context: Reading methodology/01_philosophy.md and 02_spec_structure.md

> "A user who set up their `.autospec/config.yml` with `environment: vscode-copilot` would still hit the 'No LLM provider available' error running `lsp init`." — Context: Attempting to simulate `lsp init` with Copilot as the configured environment

> "The guide example says `[x] done` but the parser checks for `[x]` separately from `done`. Either works independently. The redundant format in the example is confusing and implies a specific required syntax that doesn't match the actual parser." — Context: Trying to understand how to mark a task complete in tasks.md

> "For BudgetBuddy (a CLI with no frontend, no database, no DevOps setup) the `03_frontend_lead.md` would contain a fallback placeholder. Half the generated AutoSpec files would basically be empty stubs pointing back to the original spec. That makes graduate feel premature for my use case." — Context: Simulating `lsp graduate` on a minimal CLI project

> "The brownfield scanner is completely free to run and produces a surprisingly useful summary of your project in under a second — no API key, no setup, just filesystem analysis. `lsp scan .` is genuinely delightful and I wish it was the first thing the docs showed me." — Context: Best surprise observation in summary scores

---

### From Sam (Mid-Level Developer)

> "I ran into friction. The skill is designed for a project that already has a `specs/` directory and a `backlog.md` in AutoSpec format. My LSS output was in `.lsp/`. The skill's instructions reference `specs/backlog.md` directly. I had to mentally translate." — Context: Attempting to use `/execute-ticket` after `lsp init`

> "The answer isn't in the docs. The multi-agent pattern is framed entirely around AI agents working in parallel, not human developers working alongside AI agents." — Context: Asking what a junior developer does while an agent is running a sprint

> "My team would run `lsp graduate`, look at the DevOps stub, and either ignore it (bad) or manually write it (which removes the time savings that justified LightSpec in the first place)." — Context: Evaluating graduation output quality for roles 06-10

> "The scan output currently tells you what it found. It doesn't print what it couldn't detect. For a brownfield project where routes are dynamically registered, the route list will be incomplete — but you won't know that from looking at the scan output." — Context: Evaluating scan output for a Fastify monorepo project

> "Does this replace Jira? The honest answer after reading everything is: yes, intentionally, but without acknowledgment of the switching cost. For my team, we'd need to either run two systems or convince the founders that markdown files in Git replace Jira. The docs don't address this at all." — Context: Thinking through team adoption blockers

> "Getting a grounded spec in 45 seconds is better than the 45 minutes it takes us to write a PRD in Notion and then copy-paste it into Claude." — Context: Evaluating the core value proposition of `lsp init`

> "The 4-expert parallel analysis followed by 3 sequential PM passes is exactly the kind of structured planning I wish we did before every sprint. The fact that PM-B adversarially reviews PM-A's draft catches the things a single agent would rationalize away." — Context: Evaluating the `/plan-sprint` skill structure

---

### From Jordan (Senior/Staff Engineer)

> "The `docs/lss/03_scanner.md` file lists Go route detection as supported. That qualifier is doing a lot of work and the docs breeze past it. When I read the actual source code — specifically `detect-routes.ts` — the picture sharpens considerably." — Context: Auditing scanner documentation against source code implementation

> "Go is not in this primary resolution chain at all. There is no `extractGoRoutes()` function in the actual source. The documentation describes Go framework detection but the route extraction code never scans `.go` files." — Context: Tracing `detect-routes.ts` source code against documented capabilities

> "For FleetPulse, this means `lsp scan` would list `routes: []` for the entire Go backend, and the generated spec would have no API surface area from the service that actually does the telemetry ingestion, device registration, and alerting logic." — Context: Projecting scanner output onto the real FleetPulse project

> "The generated spec would treat this project as a frontend application that happens to have a Go dependency, which is exactly backwards from reality." — Context: Analyzing the implications of `hasApi: false` for a Go-primary project

> "This is not a missing feature; it is a documented feature that is not implemented, which is categorically different and undermines trust in other scanner claims." — Context: Summary scores explanation of the Go route extraction gap

> "The heading-based section matching in `extractSection()` uses case-insensitive substring search against a short list of expected heading names. LLM-generated headings vary. A heading like 'Architecture & API Design' would not match any of the four patterns tried for the backend role, falling through to a placeholder." — Context: Reading `graduate.ts` section extraction implementation

> "The briefing file approach to prevent context drift in long agent sessions is genuinely good engineering. The insight that 'conventions are re-stated in every brief, exact values are copy-pasted into the brief' is the right solution to a real problem." — Context: Evaluating `10_orchestrator_agent_pattern.md`

> "The inline fallback template silently degrades output quality. A user running from source without building would get sparse prompts without knowing the templates failed to load. The fallback should warn loudly: 'Template not found, using degraded inline fallback — run npm run build first.'" — Context: Reviewing `generate-spec.ts` fallback behavior

---

## Persona Agreement / Disagreement Matrix

| Issue | Alex | Sam | Jordan | Verdict |
|-------|------|-----|--------|---------|
| LLM provider setup is underdocumented and blocks first run | ✓ Agree (blocker) | ✓ Agree (friction) | ✓ Agree (CI/team risk) | 3/3 — universal concern, different severity by experience level |
| `lsp graduate` produces inapplicable stub files | ✓ Agree (5 of 10 empty) | ✓ Agree (DevOps stub critical) | ✓ Agree (section extraction fragile) | 3/3 — unanimous, but different root cause identified at each level |
| CLAUDE.md placeholder `[Project Name]` unfilled | ✓ Agree | ✓ Agree | ✓ Agree | 3/3 — universal, lowest severity concern but highest polish signal |
| `lsp status` fails silently on wrong working directory | ✓ Agree | ✓ Agree (pre-init crash) | ✓ Agree (no `--dir` flag) | 3/3 — same root problem, different manifestations |
| Scanner output lacks confidence/missing-data signals | ✗ Not raised | ✓ Agree (dynamic routes) | ✓ Agree (Go routes, hasApi) | 2/3 — junior did not have the context to notice; mid+ noticed immediately |
| LSS tasks.md → skills backlog.md gap | ✗ Not encountered | ✓ Agree (blocker) | ✓ Partial (noted viewer dep) | 2/3 — Alex never reached the skill layer |
| AutoSpec vs LightSpec disambiguation missing | ✓ Agree (4/5 severity) | ✓ Agree (implicit: package/binary name) | ✗ No issue (read all docs, understood distinction) | 2/3 — senior had context; junior/mid did not |
| No team workflow guide | ✗ Not relevant (solo) | ✓ Agree (strong, 4/5) | ✓ Agree (moderate) | 2/3 — solo junior not affected; both team leads raised it |
| Go route extraction undocumented gap | ✗ Not applicable | ✗ Not explicit (JS/TS project) | ✓ Agree (docs vs. code divergence) | 1/3 — but Jordan's concern is highest-trust: source code verified |
| The core scan + init value proposition works | ✓ Agree ("best part") | ✓ Agree ("most polished") | ✓ Agree (for JS/TS scope) | 3/3 — unanimous positive on the core loop when it works |

---

## Composite Journey Map: First 30 Minutes

| Phase | Touchpoint | Alex Emotion | Sam Emotion | Jordan Emotion | Key Friction Point |
|-------|-----------|--------------|-------------|----------------|-------------------|
| 1. Arrival | First read of QUICKSTART.md | Confused — "hundreds of lines that feel like they're for the AI to read, not for me" | Oriented but noting gaps — immediately noticed AutoSpec framing | Analytical — read all 10 methodology docs before touching a command | QUICKSTART.md is for AutoSpec; LightSpec entry point is missing |
| 2. Tool selection | Choosing LightSpec vs. AutoSpec | Clarified only after reading `lss/01_philosophy.md` — "I wish this had been the landing page" | Implicit (knew to start with `lsp scan` from prior exposure) | Clear from first read — "lightweight sibling to AutoSpec, not a replacement" | Philosophy doc is the correct entry point but not positioned as such |
| 3. Installation | Finding `npm install` command | Blocked — could not find install command in any assigned markdown doc | Minor — package/binary name mismatch noted but not blocking | Not encountered — already knew `npm install -g lightspec` | Install command only exists in guide web app, not in any markdown doc |
| 4. First scan | Running `lsp scan` | Delighted — "genuinely delightful" for a free, instant result | Impressed — monorepo detection worked correctly in two seconds | Skeptical → partially satisfied — Go stack detected correctly; routes silently missed | Scanner confidence display is uniform regardless of detection completeness |
| 5. Provider setup | Running `lsp init` | Hard blocked — no Claude Code, no API keys, Copilot not supported | Smooth (already had claude-code) but noted late provider confirmation | Smooth (had CLI) — but noted CI hang risk and missing `--yes` docs | Junior blocked entirely; senior/mid could proceed |
| 6. Reading output | Opening `.lsp/spec.md` | Positive (based on guide examples) — "best part of the product" | Genuinely impressed by spec quality; noted shallow data model for relational app | Positive for JS/TS scope; Go API surface absent from spec | Spec quality is high for detected content; gaps are invisible in the output |

---

## NPS Simulation

Based on each persona's "Would Recommend" answer and satisfaction score:

- **Alex:** Would Recommend: Maybe — Satisfaction: 5/10 → NPS contribution: **Detractor** (score 5 → passive threshold not met)
- **Sam:** Would Recommend: Yes, with caveats — Satisfaction: 7/10 → NPS contribution: **Passive** (score 7 → below 9-10 promoter threshold)
- **Jordan:** Would Recommend: Maybe — Satisfaction: 6/10 → NPS contribution: **Detractor** (score 6 → below passive threshold of 7)

**Raw NPS Score:** -33 (0 Promoters − 2 Detractors out of 3 total respondents = 0% − 67% = −67/3... using strict NPS: 0 promoters, 1 passive, 2 detractors: NPS = (0/3 − 2/3) × 100 = **−67**)

> Note on calculation: NPS = (% Promoters − % Detractors) × 100. With 0 promoters (0%), 1 passive (33%), and 2 detractors (67%): NPS = 0 − 67 = **−67**.

**NPS Interpretation:** A score of −67 indicates that the framework is not ready for unsupported adoption. The two detractors (junior and senior) represent opposite ends of the experience spectrum — both pointing to trust failures that strike at the core of the tool's value proposition: a junior who cannot get past the provider setup blocker never sees the framework's strengths, while a senior who reads the source code finds documented features that are not implemented. The single passive respondent (mid-level team lead) represents the framework's current actual audience: developers who already have the prerequisites, understand the scope, and can navigate the gaps. Broad adoption potential requires closing the installation, provider, and scanner accuracy gaps before this NPS can move into positive territory.

---

## Key Research Insights

### Insight 1: The First 30 Minutes Have Two Separate Blockers by Experience Level
The framework fails two different personas for two different reasons in the first 30 minutes. Junior developers (Alex) hit a hard stop at provider setup — the tool requires credentials they do not have, and the docs do not guide them to get those credentials. Senior developers (Jordan) reach the first output but find that the output's claims exceed its implementation — Go route extraction is documented as supported but not coded. Both paths lead to a trust deficit, but the trust fails at completely different layers. Mid-level developers (Sam) with existing Claude access represent the only unblocked first-run experience, and even they hit friction at the skill-layer boundary.

**Evidence:** Alex: "Nowhere in any of the docs I read is there a plain step saying 'if you use VS Code + Copilot, here is how to get an API key.'" Jordan: "This is not a missing feature; it is a documented feature that is not implemented, which is categorically different and undermines trust in other scanner claims."

---

### Insight 2: The LSS-to-Skill Pipeline Has a Structural Handshake Failure
The framework's most significant UX gap is not a documentation problem — it is an architectural one. The LSS layer terminates in `.lsp/tasks.md`. The skill layer reads `specs/backlog.md`. These formats are not compatible, and the only documented bridge is `lsp graduate`, which is framed as a future milestone rather than an immediate prerequisite. Every developer who follows the natural progression from `lsp init` to `/execute-ticket` will hit this wall. Sam identified it as a 4/5 severity issue; Jordan observed the same structural break from the skill layer direction. No documentation says "you cannot use the skills without graduating or creating the bridge file."

**Evidence:** Sam: "The two systems don't have a clean handshake at the ticket execution level. I ended up manually reformatting a few tasks from `tasks.md` into a `specs/backlog.md` so the skill could read them." Jordan (on viewer dependency): "The sprint-run skill would either fail or require the user to skip those phases manually — there's no conditional logic documented."

---

### Insight 3: The Scanner's Confidence Display Does Not Match Its Detection Confidence
All three personas identified scanner output that presented partial or incorrect results with the same visual treatment as complete and accurate results. Sam noted that dynamically registered routes produce no warning. Jordan traced the Go route extraction gap to source code, finding that a documented capability (`detect-routes.ts` claiming Gin/Echo/Fiber/Chi support) is entirely absent from the implementation. Alex found that "unknown" architecture receives no different treatment from a detected architecture. The common root cause is that `lsp scan` terminates with "Scan complete ✓" in all cases, giving no signal that the developer should supplement or distrust the output.

**Evidence:** Sam: "It doesn't print what it couldn't detect. As a team lead I want a 'low-confidence signals' section." Jordan: "The tool shows confidence — 'Scan complete ✓' — without surfacing the gap. A developer unfamiliar with the scanner's limitations would trust the output and get a spec that describes half the system."

---

### Insight 4: Graduate Output Quality Is Insufficient to Justify the "Upgrade" Framing
All three personas evaluated `lsp graduate` and none described the output as a complete or trustworthy upgrade. Alex found 5 of 10 role files were inapplicable stubs. Sam found the DevOps spec — a critical artifact for their deployment needs — was essentially empty. Jordan found that the heading extraction is fragile enough that LLM-generated heading variations produce placeholder output that looks identical to successfully extracted content until you read it carefully. The CLAUDE.md placeholder issue (`[Project Name]`) was the most universal signal: it is the first thing a developer opens after graduation and it immediately reveals that the output is less finished than the "graduate your project" framing implies.

**Evidence:** Alex: "I went from one focused spec file to ten files where half say 'TODO.'" Sam: "My team would run `lsp graduate`, look at the DevOps stub, and either ignore it or manually write it — which removes the time savings that justified LightSpec." Jordan: "The current behavior silently produces stub files that look identical to successfully extracted sections until you read their contents."

---

### Insight 5: The Orchestrator + Agent Pattern and Core Scan Engine Are Genuine Strengths — Unanimously
Despite the friction inventory, all three personas identified the same two strengths independently and without prompting: the brownfield scan engine (fast, free, accurate for JS/TS) and the orchestrator + agent pattern with briefing files (context isolation, parallel execution). These were the "best surprises" for two personas and the highest-rated component in Jordan's structured assessment (9/10). This convergence suggests the framework has a defensible core — the problems are in the onboarding layer, the scan coverage gaps, and the pipeline integration points, not in the underlying design philosophy.

**Evidence:** Alex: "`lsp scan .` is genuinely delightful." Sam: "The scan output was clean, readable, and fast — honestly the most polished part of the whole experience." Jordan: "The briefing file approach to prevent context drift is genuinely good engineering that I would apply outside this framework entirely." On the orchestrator: Sam gave `plan-sprint` the most enthusiastic individual evaluation of any single feature across all three reports.

---

## Recommendations for Expert Reviewers

1. **The Go route extraction documentation/implementation divergence is the most urgent trust issue.** Jordan verified from source code that `detect-routes.ts` documents Gin/Echo/Fiber/Chi support but contains no `.go` glob and no `extractGoRoutes()` function. Before expert review, the team should confirm: is this a backlog item with a known ETA, or an oversight? If it is a known limitation, every piece of documentation that claims Go route support needs a "Known Limitation" callout immediately. If the capability is planned, reviewers should assess whether the current documentation creates a false capability claim that is actively harmful to user trust.

2. **Where is the authoritative entry point for a new user?** All three personas started at different documents and had different first-run experiences. Expert reviewers should evaluate whether a single "LightSpec Quick Start" document exists or should be created that (a) contains `npm install -g lightspec`, (b) explains LightSpec vs. AutoSpec selection criteria, (c) provides a minimum provider setup guide with cost context, and (d) does not reference any AutoSpec-specific workflows. The current QUICKSTART.md serves AutoSpec and should be renamed or restructured accordingly.

3. **Is the LSS-to-skill gap intentional product design or a version lag?** The disconnect between `.lsp/tasks.md` and `specs/backlog.md` was the highest-severity issue for the mid-level persona and appeared in the senior's analysis as well. Reviewers familiar with the development timeline should assess: was this gap ever documented as a limitation, and does the roadmap include a `lsp init-backlog` bridge command or similar? The gap is architectural and requires a product decision, not just documentation.

4. **How should the `lsp graduate` stub quality problem be scoped for a fix sprint?** Graduate produces stubs for inapplicable roles, does not fill the `[Project Name]` placeholder, does not warn before overwriting `CLAUDE.md`, and has fragile heading extraction with no `--dry-run` validation mode. These are four separable issues. Expert reviewers should triage: which one causes the most abandonment at the graduation step, and which is cheapest to fix? Jordan's recommendation (a `--dry-run` mode for graduation that shows extraction confidence per section) may be the highest-leverage single change.

5. **Is the NPS profile and target audience definition understood internally?** The study found that the framework's current unblocked audience is mid-level developers who already have Claude Code or API credentials and are working on Node.js/TypeScript projects. Juniors are blocked at provider setup. Seniors on polyglot projects are blocked at scanner trust. Team leads are blocked at the team workflow gap. Reviewers should discuss: is this the intended target audience, or is the framework positioned more broadly? If the intent is broader adoption, which of the three blockers (provider setup, scanner coverage, team workflow) is the highest-priority investment?

