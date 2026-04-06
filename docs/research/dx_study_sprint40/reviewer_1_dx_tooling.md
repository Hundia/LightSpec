---
name: Expert Review 1 — DX Tooling Specialist
type: research
sprint: 40
---

# Expert Review 1 — DX Tooling Specialist

## Reviewer Profile

I am a DX tooling specialist with 12 years of experience evaluating CLI frameworks, scaffolding tools, and developer onboarding systems. I have reviewed Create React App, Vite, Nx, Turborepo, and similar tools. I have NOT used LightSpec before this review.

---

## Cold Read Summary

My first read of LightSpec/AutoSpec produced a clear first impression: this is a framework with a genuinely interesting core idea wrapped in a documentation structure that actively resists comprehension.

**What I understood immediately:** The concept of adaptive spec depth — scan a project heuristically, score it on a complexity scale, generate a proportionate spec — is a real insight. Most scaffolding tools impose a fixed output regardless of project scale. The three-tier depth model (micro/standard/full) is the kind of pragmatic design decision that comes from actually watching developers waste time on over-engineered process. The brownfield-first approach (scan before generate) is architecturally sound: grounding LLM generation in real filesystem data rather than hypothetical inputs is meaningfully better than "describe your project in a prompt."

**What impressed me during the cold read:** The `lsp scan` output design. In `scan.ts` and `complexity-scorer.ts`, I can see a clean separation between data gathering, scoring, and presentation. The scoring algorithm is deterministic and legible — you can predict your score roughly before running the tool. The polyglot stack detection running five ecosystem parsers in parallel via `Promise.all` in `detect-stack.ts` is competent engineering. The Handlebars template system with XML-tagged constraints and brownfield JSON injection is a well-reasoned prompt architecture for the LLM calls.

The orchestrator + agent briefing file pattern, as described in the methodology docs, is the kind of practical systems thinking that I rarely see codified in developer tooling. The insight that context drift in long LLM sessions is solved by writing exact values into a brief file before spawning agents — that's not obvious and it's correct.

**What confused me during the cold read:** The relationship between LightSpec and AutoSpec is not explained at any entry point I encountered. `QUICKSTART.md` begins with a three-step AutoSpec workflow using `{{INPUT_FOLDER}}` template syntax, while `lsp init` is a completely different execution model. These two systems share terminology (specs, backlog, sprints) but have incompatible workflows, and nothing in the primary documentation surface explains the distinction or which one to use.

The install path for LightSpec as a CLI tool (`npm install -g lightspec`) appears only in the interactive guide web application, not in any Markdown documentation I reviewed. For a new developer reading docs in a terminal, this is a missing prerequisite.

The `lsp graduate` command produces 10 role spec files regardless of what the project actually contains. Reading `graduate.ts`, roles 06-10 are always stubs with TODO comments. For a project with no frontend, no database, and no DevOps infrastructure, the graduation output looks complete (10 files written) but is substantively incomplete for the majority of generated files.

The documentation describes Go route extraction for Gin/Echo/Fiber/Chi as a supported scanner capability. Reading `detect-routes.ts`, there is no `.go` file glob anywhere in the route scanning code. The capability does not exist. This is the most significant documentation/implementation divergence I found in my cold read.

---

## Framework Strengths

1. **Adaptive depth selection eliminates the "one size fits all" problem of most scaffolding tools:**
   The three-tier depth model (micro at 0-30 complexity, standard at 31-65, full at 66-100) directly addresses the failure mode of tools like Create React App — which applies the same generation logic to a 3-file CLI tool and a 200-file enterprise app. The scoring algorithm in `complexity-scorer.ts` is deterministic and auditable: file count (25pts), line count (20pts), architecture pattern (20pts), stack breadth (15pts), component flags (10pts), test maturity (10pts). A developer can predict the output before running the command.
   - Evidence: Cold read of `complexity-scorer.ts` scoring function; guide step 2 ("Complexity Estimate: score ~38/100 → Standard depth").

2. **Brownfield-first scan produces genuinely grounded LLM context:**
   Rather than asking the user to describe their project in a prompt (which is both tedious and error-prone), `lsp scan` extracts stack, architecture, routes, docs, and test maturity from the filesystem. This brownfield context is then injected as `JSON.stringify(scanResult.context)` into the Handlebars generation prompt, giving the LLM actual detected data to reason against. Sam (mid-level trial) confirmed: the spec inferred the feature domain correctly from directory structure alone, and produced an API endpoint table for routes that were not explicitly specified anywhere.
   - Evidence: Sam trial: "The API endpoint table had `POST /api/meetings`, `GET /api/meetings/:id`, action item routes — it had inferred the feature domain correctly from the project name and scaffold structure. I didn't write a PRD. I ran one command."

3. **Zero-config provider auto-resolution removes a meaningful onboarding barrier:**
   The provider resolution chain (`claude` CLI → `ANTHROPIC_API_KEY` → `GEMINI_API_KEY`) in `init.ts` means that a developer who already has any of these configured gets spec generation without writing a config file. Compare this to Nx or Turborepo where preset selection and workspace configuration require multiple interactive steps. For the target audience (developers who already use Claude or have an API key), this is a legitimate zero-config experience.
   - Evidence: Cold read of `init.ts` `resolveProvider()` call; guide step 4 callout: "If claude is in your PATH and authenticated, it uses claude-code (no API key needed)."

4. **The orchestrator + agent briefing file pattern is production-grade systems thinking:**
   The architecture described in the methodology docs — where an orchestrator writes a `sprint-X-brief.md` with exact file paths, hex values, and code snippets before spawning implementation agents — solves a real problem: LLM context drift and hallucinated values in long agent sessions. The pattern is not specific to LightSpec; it's portable best practice. Jordan (senior trial) rated this 9/10, the highest component score in any trial report.
   - Evidence: Jordan trial: "The insight that 'conventions are re-stated in every brief, exact values are copy-pasted into the brief' is the right solution to a real problem." Cold read of methodology docs confirms this is explicitly documented and not just implicit.

5. **The `lsp scan` command is cost-free and produces immediately useful output:**
   Running entirely on filesystem analysis with no LLM calls, `lsp scan .` executes in under a second and produces a structured summary of language, framework, architecture pattern, and complexity. This has genuine standalone value as a project audit tool, independent of any spec generation. Alex (junior trial) described it as "genuinely delightful" and noted it as the best surprise in the entire evaluation.
   - Evidence: Alex trial: "`lsp scan .` is genuinely delightful and I wish it was the first thing the docs showed me." Cold read confirms no API calls in `scan.ts` — it calls only `scanProject()` from the local scanner module.

6. **The `/plan-sprint` skill's multi-agent structure provides adversarial quality control:**
   The four parallel expert agents (Architect, UX/UI, Database, Human Experience) followed by three sequential PM passes (Drafter → Adversarial Reviewer → Finalizer) is a structured approach to catching the rationalizations and blind spots that a single-pass plan would miss. The adversarial review step — where PM-B explicitly challenges PM-A's draft — is what separates this from a standard LLM planning prompt.
   - Evidence: Sam trial: "The 4-expert parallel analysis followed by 3 sequential PM passes is exactly the kind of structured planning I wish we did before every sprint. PM-B adversarially reviews PM-A's draft catches the things a single agent would rationalize away."

7. **The Handlebars template + XML constraint system produces consistent, bounded LLM output:**
   The use of `<constraints>` XML tags and explicit `<output_format>` sections in the generation prompts gives the LLM a tightly scoped instruction. This is a better prompt architecture than vague "write a spec" instructions, and it explains why the generated spec quality is consistently above what you'd get from a simple LLM prompt with project description. The brownfield context JSON injection means the model is reasoning about detected data.
   - Evidence: Sam trial: "The `brownfieldContext` JSON injection means the model is reasoning about actual detected data, not guessing. This is why the generated spec quality is noticeably above what you'd get from a generic 'write a spec for a Fastify app' prompt." Cold read of `package.json` confirms Handlebars as a dependency.

8. **YAML frontmatter on generated specs provides data provenance:**
   Every generated spec includes `depth`, `date`, `complexity_score`, and `provider` in YAML frontmatter. This makes specs self-describing and auditable — a developer looking at a spec six months later can understand how it was generated, what depth decision was made, and which LLM produced it. This is a detail that many scaffolding tools skip but that matters for brownfield projects where the spec needs to stay current.
   - Evidence: Cold read of guide step 5 fileViewer example showing frontmatter; Alex trial noted this as a positive: "This is how lsp init knows not to regenerate if a spec exists, and how lsp graduate reads the context."

---

## Framework Weaknesses

1. **The entry point documentation sends users to the wrong tool:**
   `QUICKSTART.md` — the primary documentation artifact, the file that defines the AutoSpec framework's onboarding experience — describes the AutoSpec 9-role generation workflow using `{{INPUT_FOLDER}}` template syntax. It lists `vscode-copilot` as a supported environment and describes how to use Copilot Chat for AutoSpec skills. None of this is relevant to `lsp init`. A developer who wants to use the `lsp` CLI must discover that LightSpec is a separate tool through a different document (`lss/01_philosophy.md`) that is not the first thing they encounter. For a category of tools where the first three minutes determine adoption, this is a first-class DX failure.
   - Evidence: Alex trial (severity 4): "QUICKSTART.md is for AutoSpec. `lsp init` is LightSpec. The two tools share terminology but have completely different workflows. Nothing in QUICKSTART.md explains LightSpec or `lsp` commands." Researcher synthesis Category 1: "Every persona experienced a different version of the same confusion."

2. **The LLM provider requirement is undisclosed until failure:**
   The tool's "zero config" framing implies no prerequisites. In practice, `lsp init` requires either the Claude Code CLI installed and authenticated, or an `ANTHROPIC_API_KEY` or `GEMINI_API_KEY` environment variable. A developer using GitHub Copilot — which `QUICKSTART.md` explicitly lists as a supported environment — will configure their setup for Copilot, run `lsp init`, and receive "No LLM provider available" with no recovery guidance. No documentation in the primary onboarding path explains this constraint. The error message provides no actionable next step, no link, and no cost context.
   - Evidence: Alex trial (severity 5): "Nowhere in any of the docs I read is there a plain step saying 'if you use VS Code + Copilot, here is how to get an API key for the LLM that lsp init needs.'" Researcher synthesis Category 2: "Provider configuration is the single largest first-run blocker across all experience levels."

3. **Go route extraction is documented as implemented but is not:**
   `docs/lss/03_scanner.md` contains a table of supported route detection patterns including "Gin/Echo/Fiber/Chi: `.GET("/path", ...)` regex." Reading `detect-routes.ts`, there is no `extractGoRoutes()` function, no `.go` file glob in the route scanning section, and no Go-specific code path in the framework resolution chain. The documentation describes a capability that does not exist in the implementation. This is categorically worse than a missing feature — it is a false capability claim. For any team with a Go backend, this means the generated spec will have an empty routes section and `hasApi: false`, producing a spec that misrepresents the project's primary concern.
   - Evidence: Jordan trial (severity 4): "This is not a missing feature; it is a documented feature that is not implemented, which is categorically different and undermines trust in other scanner claims." Cold read of `detect-routes.ts` source confirmed independently.

4. **The `lsp graduate` command has multiple independent quality failures:**
   The graduation command is framed as an upgrade path from LightSpec to AutoSpec. In practice it has four distinct failure modes: (a) roles inapplicable to the project type are always generated as stubs (a CLI project gets `03_frontend_lead.md` with placeholder text), (b) heading-based section extraction uses substring matching against a short list of expected headings that LLM-generated specs frequently do not use, (c) the `CLAUDE.md` it generates contains a literal `[Project Name]` placeholder that must be manually filled, and (d) it overwrites any existing `CLAUDE.md` without warning. All three trial personas independently found quality problems with graduation, though each identified different root causes.
   - Evidence: Alex trial: "I went from one focused spec file to ten files where half say 'TODO.'" Jordan trial: "A heading like 'Architecture & API Design' would not match any of the four patterns tried for the backend role, falling through to a placeholder." Researcher synthesis Category 5: "`lsp graduate` presents itself as an upgrade path, but the current implementation has four independent failure modes."

5. **The pipeline between LightSpec output and the skill layer is broken without documentation:**
   `lsp init` terminates in `.lsp/tasks.md`. The AutoSpec skill layer (`/execute-ticket`, `/sprint-run`, `/sprint-status`) reads `specs/backlog.md`. These two files have different formats, different locations, and different purposes, and there is no documented bridge between them. `lsp graduate` is the only documented path to create `specs/backlog.md`, but it is framed as a future milestone and produces stub files of questionable quality. A developer who follows the natural progression — scan, init, start building, try to use execute-ticket — will silently fail at the skill-layer boundary with no explanation of why.
   - Evidence: Sam trial (severity 4): "The two systems don't have a clean handshake at the ticket execution level." Researcher synthesis Insight 2: "The framework's adoption funnel has a critical gap between its lightweight entry tool and its primary value delivery mechanism."

6. **The task completion workflow requires fragile manual file editing:**
   Marking a task done requires opening `.lsp/tasks.md` in an editor, locating the correct table row, and editing the status cell. The `status.ts` parser uses a regex on the table structure. If a table pipe is misaligned, the task is silently dropped from the count. There is no `lsp done <id>` command. The guide example shows `[x] done` but the actual parser accepts `[x]` alone — a minor inconsistency that creates doubt about the canonical format. By contrast, every modern task management CLI (GitHub CLI, Linear CLI) provides a `mark-complete` or equivalent command. This is a regression in ergonomics relative to what developers have come to expect.
   - Evidence: Alex trial: "There is no CLI command like `lsp done 3` to mark task #3 complete without touching the file." Researcher synthesis Category 6: "The lack of a `lsp done <id>` command is the most universally noted gap."

7. **The scanner presents partial results with uniform confidence:**
   `lsp scan` terminates with "Scan complete ✓" regardless of what it actually detected. A Go project where route extraction produces an empty array looks identical in output format to a TypeScript project where routes were fully detected. There is no confidence signal, no "low confidence" flag, and no "detected nothing here — you may want to supplement with --srs" message. Sam noted that dynamically registered routes in Fastify produce no warning; Jordan traced this to the Go case where the documentation claims support that doesn't exist. The tool shows certainty where it has none.
   - Evidence: Sam trial: "The scan output currently tells you what it found. It doesn't print what it couldn't detect." Jordan trial: "The tool shows confidence — 'Scan complete ✓' — without surfacing the gap."

8. **The `--force` flag is documented in the guide but does not exist in the implementation:**
   Guide step 5 shows `lsp init . --depth=full --force` as the command to regenerate at a different depth. Reading `init.ts`, there is no `--force` flag in the options parsing. Running `lsp init` a second time will regenerate (there is no existence check on the output), but the user experience for this — confirmed via source code by Sam — is that the tool simply overwrites without warning, not that `--force` enables overwrite. The guide shows a command that does not behave as described.
   - Evidence: Sam trial: "Reading the `init.ts` source code, I don't see `--force` handled in the `opts` parsing." Jordan trial friction log item 7: "Overwrites existing spec without warning." Researcher synthesis Category 1 (part of broader undocumented flag issue).

---

## Benchmark Comparison

Compare LightSpec against comparable tools:

| Dimension | LightSpec | Create React App / Vite | Nx / Turborepo | Verdict |
|-----------|-----------|------------------------|----------------|---------|
| Time to first success | 45-90s to spec (if provider configured); blocked for users without Claude/Gemini | ~30s to running app (CRA); ~10s (Vite) | 2-5min for workspace setup | **Loss** for first-timers (provider barrier); **Win** for users with credentials vs. what they get |
| Error message quality | Terse: "No LLM provider available" with no recovery guidance; `process.exit(1)` for all errors | Moderate: CRA errors are verbose but often point to the right fix | High: Nx gives actionable error codes and docs links | **Loss** — below industry standard for actionable error messaging |
| Documentation clarity | Fragmented across AutoSpec/LightSpec with no clear entry point; install command missing from markdown docs | High: single README with copy-paste quickstart | High: dedicated docs site with clear getting-started path | **Loss** — structural problem, not volume problem |
| Brownfield support | Strong for JS/TS; partially credible for Python; incomplete for Go (undocumented gap) | None — greenfield only | Partial — detects existing workspace structure but no spec generation | **Win** for JS/TS brownfield; **Loss** for polyglot |
| Multi-stack support | JS/TS/Python/Go/Rust/Ruby detected; route extraction only for JS/TS/Python | JS/TS ecosystem only | JS/TS/Java (Gradle) ecosystem; limited others | **Win** on detection breadth; **Neutral** on extraction depth |
| Extensibility | Locked complexity weights and `hasApi` signals; no `.lssrc.json`; no plugin API | No extension model | Plugin system via Nx plugins; custom generators | **Loss** — no extensibility model documented or accessible |
| Adaptive output | Core differentiator — three depth tiers calibrated to project scale | None — fixed output | Preset-based (app/library/etc.) but not complexity-adaptive | **Win** — this is LightSpec's strongest differentiation from all benchmarks |
| Task tracking integration | Manual markdown editing; no `lsp done <id>`; no external tracker integration | N/A | N/A | **Loss** vs. GitHub CLI, Linear CLI, or any purpose-built tracker |
| Team collaboration | Entirely unaddressed for 2-5 person teams; no concurrent access model | N/A | Strong — designed for monorepo team workflows with caching and parallelism | **Loss** for team adoption scenarios |

---

## Adoption Risk Assessment

| Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
|------|-------------------|----------------|------------|
| Junior developers blocked at provider setup before seeing any value | H | H | Add a free-provider quick-start path (Gemini free tier) with exact commands in a LightSpec-specific README |
| Trust erosion from documented-but-unimplemented Go route extraction | H (for any Go user) | H | Either implement `extractGoRoutes()` (low effort) or add "Known Limitations: Go route extraction not yet implemented" prominently to scanner docs |
| Teams abandoning the skill layer after LSS-to-backlog.md gap | M | H | Implement `lsp init-backlog` bridge command or add explicit migration instructions; this is a medium-effort fix with high adoption impact |
| Viral negative word-of-mouth from "Scan complete ✓" false confidence on polyglot projects | M | H | Add confidence signals to scan output; at minimum surface what was NOT detected |
| `lsp graduate` CLAUDE.md overwrite destroying existing project memory files | M | H | Add a `--dry-run` flag to graduate; add a `--no-claude-md` flag; add overwrite confirmation prompt |
| Framework version drift (9-role vs 10-role inconsistency) erodes trust in documentation accuracy | M | M | Audit and reconcile all role count references across methodology docs and graduate.ts; create a single source of truth |
| CI pipelines hanging on readline confirmation without `--yes` flag | M (for any CI user) | M | Document `--yes` flag prominently; add TTY detection that defaults to non-interactive in CI contexts |
| Complexity scoring changes causing spec depth regression as projects grow | L | M | Consider a `--lock-depth` flag or scan result caching so teams aren't surprised by depth changes on re-run |
| Graduation heading extraction fragility producing empty role specs silently | H | M | Add `lsp graduate --dry-run` mode; add extraction confidence output; write tests for LLM heading variations |
| Early adopters treating the framework as production-ready when it has known capability gaps | H | H | Add a clear "v0.1.0 — Known Limitations" section to every primary doc; version the scanner capability matrix |

---

## Priority Improvement Areas (ranked 1-10)

| Rank | Area | Evidence Source | Effort (S/M/L) | Impact (H/M/L) |
|------|------|----------------|----------------|----------------|
| 1 | LightSpec standalone quick-start with install + provider setup guide | Alex (severity 5), researcher synthesis Category 1 + 2 | S | H |
| 2 | Go route extraction: implement or honestly document the gap | Jordan (severity 4 — source verified), researcher synthesis Category 4 | S (document) / M (implement) | H |
| 3 | LSS-to-skill bridge: `lsp init-backlog` command or migration doc | Sam (severity 4), researcher synthesis Insight 2 | M | H |
| 4 | Scanner confidence signals: surface what was not detected | Sam (severity 3), Jordan (severity 4), researcher synthesis Insight 3 | M | H |
| 5 | `lsp graduate` quality: dry-run mode, CLAUDE.md project name injection, role relevance filtering | Alex + Sam + Jordan (all severity 3), researcher synthesis Category 5 | M | H |
| 6 | `lsp done <id>` CLI command for task completion | Alex + Jordan (both severity 2), researcher synthesis Category 6 | S | M |
| 7 | Provider error message with recovery instructions and cost context | Alex (severity 5), Jordan (severity 2) | S | H |
| 8 | Document `--yes`, `--dry-run`, all flags in a single CLI reference page | Sam + Jordan (multiple severity 2-3 items), researcher synthesis Category 1 | S | M |
| 9 | Team workflow guide for 2-5 person hybrid human+AI teams | Sam (severity 4), Jordan (severity 3), researcher synthesis Category 7 | M | M |
| 10 | `lsp status` path resolution: accept `--dir` flag, error helpfully when not in project root | Alex + Sam + Jordan (all severity 2-3), researcher synthesis Category 6 | S | M |

---

## Specific Actionable Recommendations

1. **Create `LIGHTSPEC_QUICKSTART.md` as a standalone entry point for the `lsp` CLI:**
   The current `QUICKSTART.md` serves AutoSpec's AI-paste workflow and cannot be fixed to also serve LightSpec — they are different tools with different models. Create a dedicated quick-start file that contains exactly: (1) `npm install -g lightspec`, (2) `lsp scan .` to see your complexity score with no prerequisites, (3) provider setup table (Claude Code — installed, Anthropic API — from anthropic.com (free $5 credit), Gemini CLI — free at aistudio.google.com), (4) `lsp init .` with expected output. Do not mention AutoSpec, role specs, or sprints in this document.
   - Effort: S
   - Expected impact: Eliminates the first-30-minutes blocker for all experience levels; removes the primary driver of the -67 NPS score.

2. **Implement Go route extraction or add a "Known Limitations" table to scanner docs:**
   The go route extraction gap is a documentation honesty problem. Option A (preferred): implement `extractGoRoutes()` — the regex patterns for Gin `.GET("/path", handler)` / Echo `.GET("/path", handler)` are trivial; add `**/*.go` to the route scanning glob; a two-hour implementation. Option B: add a prominently placed table in `docs/lss/03_scanner.md` with columns "Language," "Stack Detection," "Route Extraction," and "hasApi Detection" showing exact support levels. Either is acceptable; shipping documentation that describes unimplemented features is not.
   - Effort: S (document) or M (implement)
   - Expected impact: Restores trust for senior/staff engineers who verify documentation against source code; prevents false confidence for Go teams.

3. **Add `lsp init-backlog` (or `lsp bridge`) to create a minimal `specs/backlog.md` from `tasks.md`:**
   The structural gap between `.lsp/tasks.md` and `specs/backlog.md` is the most consequential architectural break in the user journey. Add a command (or a `--backlog` flag on `lsp init`) that converts the existing `tasks.md` into a properly formatted Sprint 1 backlog entry in `specs/backlog.md`, with default model assignments (`sonnet`) and ownership (`Fullstack`). This single command bridges the two halves of the framework without requiring full graduation.
   - Effort: M
   - Expected impact: Mid-level and above developers can use the skill layer immediately after `lsp init`; removes the 4/5 severity blocker Sam identified.

4. **Add scan confidence signals to `lsp scan` output:**
   After the detection section, add a "Detection Confidence" subsection that lists what the scanner could not find, not just what it found. Specific items: if `hasApi: false`, add "API presence: not detected (check that your API directory uses one of: routes/, controllers/, handlers/, api/)"; if `routes: []` for a Go project, add "Go route extraction: not supported (see Known Limitations)"; if architecture is `unknown`, add "Architecture: could not classify — flat source structure detected." The `--json` output mode already exposes these values; surface them in the human-readable output.
   - Effort: M
   - Expected impact: Prevents the "false confidence" trust problem identified by both Sam and Jordan; allows developers to make informed decisions about when to use `--srs` to supplement the scan.

5. **Add `lsp done <id>` command and fix the `lsp status` path resolution:**
   Two changes to the task management layer. First, add `lsp done <n>` that reads `.lsp/tasks.md`, finds task #n, marks it done by setting the status cell to `[x]`, and writes the file back. This eliminates the manual-edit workflow and eliminates the silent parse failure from accidentally malformed table rows. Second, add a `--dir <path>` flag to `lsp status` and `lsp graduate`, and add upward directory search (walk from cwd to root looking for `.lsp/`) so that running these commands from a subdirectory works as expected.
   - Effort: S
   - Expected impact: Eliminates the most commonly noted daily friction point; removes silent failures that look like tool bugs to new users.

6. **Fix `lsp graduate` quality: project name injection, dry-run mode, role relevance filtering:**
   Three targeted fixes. (1) Inject `path.basename(process.cwd())` instead of the literal `[Project Name]` in the generated CLAUDE.md title — this is a two-line fix. (2) Add `lsp graduate --dry-run` that prints what content would map to each role spec, with confidence ratings, before writing any files. (3) Add role relevance filtering: before generating a role file, check the scan result (available from `.lsp/` metadata or a fresh scan). If `hasFrontend: false`, skip or clearly flag `03_frontend_lead.md`. If `hasDatabase: false`, skip or clearly flag `04_db_architect.md`. Add a `--roles` flag as an override.
   - Effort: M
   - Expected impact: Graduation output is trustworthy for its stated purpose; the CLAUDE.md fix alone is the highest-signal polish improvement available.

---

## Draft Sprint 41 Tickets (3-5)

### Ticket: LightSpec Standalone Quick-Start Document
- **Owner:** Docs
- **Model:** sonnet
- **Points:** 2
- **Description:** Create `/opt/LightSpec/QUICKSTART.md` (distinct from AutoSpec's QUICKSTART.md) as the canonical entry point for new LightSpec users. Must include: install command, `lsp scan` as first step (no prerequisites), provider setup table with free-tier options for Anthropic and Gemini, and a complete example showing scan output, init output, and reading the spec. Must NOT reference AutoSpec workflows, role specs, or sprint skills. Cross-link from the AutoSpec QUICKSTART for the "I need something lighter" path.
- **Acceptance Criteria:**
  - [ ] File exists at `/opt/LightSpec/QUICKSTART.md` with `npm install -g lightspec` as first command
  - [ ] Provider setup table covers at minimum: claude-code (no key needed), Anthropic API (free credit link), Gemini CLI (free tier link)
  - [ ] A developer with no LLM credentials can follow this document to set up a provider in under 5 minutes
  - [ ] Document does not use terms "AutoSpec," "role spec," "sprint," or "execute-ticket"
  - [ ] Provider error recovery instructions from step 3 are reproduced verbatim in the error output section of `init.ts`

### Ticket: Scanner Known Limitations Documentation and Go Route Extraction
- **Owner:** CLI
- **Model:** sonnet
- **Points:** 3
- **Description:** Address the most critical trust issue in the framework: `docs/lss/03_scanner.md` describes Gin/Echo/Fiber/Chi route extraction with regex examples, but `detect-routes.ts` contains no `.go` file scanning. Either implement `extractGoRoutes()` with a `**/*.go` file glob and the documented regex patterns (preferred, estimated 2-3 hours), or add a prominently placed "Scanner Coverage Matrix" table to `03_scanner.md` with honest per-language capability levels. If implemented, add integration test covering a minimal Go + Gin file with one route registration.
- **Acceptance Criteria:**
  - [ ] Either `detect-routes.ts` includes a `extractGoRoutes()` function that correctly parses `r.GET("/path", handler)` and equivalent patterns, OR
  - [ ] `docs/lss/03_scanner.md` has a "Known Limitations" section that explicitly states Go/Rust/Ruby route extraction is not implemented
  - [ ] If implemented: `lsp scan` on a Go + Gin project with 3 routes returns `routes.length === 3`
  - [ ] The scanner documentation table is accurate relative to the implementation in all claims
  - [ ] `hasApi` detection is documented with the exact directory names and filenames that trigger it

### Ticket: `lsp init-backlog` Bridge Command
- **Owner:** CLI
- **Model:** sonnet
- **Points:** 3
- **Description:** Add a `lsp init-backlog` command (or `--backlog` flag on `lsp init`) that reads `.lsp/tasks.md` and creates a minimal `specs/backlog.md` in AutoSpec Sprint 1 format, making the LSS output immediately compatible with the AutoSpec skill layer without requiring full graduation. Each task from `tasks.md` becomes a backlog ticket with default fields: Owner=Fullstack, Model=sonnet, Points=estimated from time estimate (1h=2pts, 2h=3pts, 30m=1pt). Add documentation note to `lsp init` success output: "Ready to use AutoSpec skills? Run `lsp init-backlog` to create specs/backlog.md."
- **Acceptance Criteria:**
  - [ ] `lsp init-backlog` command exists and reads from `.lsp/tasks.md`
  - [ ] Output file is `specs/backlog.md` in correct Sprint 1 format compatible with `/execute-ticket`
  - [ ] Each task row includes at minimum: ID, Ticket title, Status (🔲 Todo), Owner, Model
  - [ ] Running `/execute-ticket` on a ticket from the generated backlog.md succeeds without manual editing
  - [ ] Error message if `.lsp/tasks.md` not found: "Run `lsp init` first"

### Ticket: Scanner Confidence Signals in `lsp scan` Output
- **Owner:** CLI
- **Model:** haiku
- **Points:** 2
- **Description:** Add a "Detection Confidence" section to `lsp scan` output (both pretty-print and JSON modes) that surfaces what the scanner could not detect, not just what it found. Specific additions: (1) if `routes.length === 0`, print the reason (no route files found / Go route extraction not supported / dynamic registration suspected); (2) if `hasApi: false`, suggest checking directory names against the supported list; (3) if `architecture.pattern === 'unknown'`, explain what directory structures trigger pattern detection. This does not change any scoring logic — it only changes the output presentation.
- **Acceptance Criteria:**
  - [ ] `lsp scan` output includes a "Detection Confidence" section when any signal has low confidence
  - [ ] If `routes.length === 0` and `techStack.frameworks` includes a Go framework, output includes: "Go route extraction not supported — routes section will be empty in generated spec"
  - [ ] If `hasApi: false`, output includes the directory names that would trigger `hasApi: true`
  - [ ] `--json` output includes a `confidence` object with per-signal confidence levels
  - [ ] A TypeScript project with a `routes/` directory continues to show no confidence warnings (no regression)

### Ticket: `lsp done <id>` Command and `lsp status` Path Robustness
- **Owner:** CLI
- **Model:** haiku
- **Points:** 2
- **Description:** Two task management improvements. (1) Add `lsp done <id>` command that marks task N as done by updating `.lsp/tasks.md` programmatically — finds the row by ID, sets the status cell to `[x]`, writes the file. Add `lsp undone <id>` as the inverse. (2) Fix `lsp status` and `lsp graduate` to accept a `--dir <path>` flag specifying where `.lsp/` lives; add upward directory search from `process.cwd()` to the filesystem root so that running `lsp status` from a subdirectory works without cd-ing first.
- **Acceptance Criteria:**
  - [ ] `lsp done 3` marks task #3 as done in `.lsp/tasks.md` and prints confirmation
  - [ ] `lsp undone 3` reverses the operation
  - [ ] `lsp done 99` (non-existent task) prints "Task #99 not found" rather than silently doing nothing
  - [ ] Running `lsp status` from `src/` subdirectory of a project with `.lsp/` at root succeeds
  - [ ] `lsp status --dir ./packages/api` reads from `./packages/api/.lsp/tasks.md`
  - [ ] `lsp graduate --dir ./packages/api` reads LSP from and writes specs to the specified directory

---

## Overall Assessment

LightSpec has a defensible, differentiated core: the brownfield-first scan-then-generate pipeline, adaptive depth selection, and the orchestrator + agent briefing file pattern are all genuine contributions to the developer tooling space that I have not seen combined elsewhere. The fundamental concept — that an LLM spec is only as good as the context it receives, and that context should come from actual code rather than developer-described summaries — is correct and the implementation for the JS/TS ecosystem demonstrates it works.

The framework's biggest opportunity is removing its own entry barriers. The value is real but it is currently gated behind a fragmented documentation layer, an undisclosed LLM credential prerequisite, and a critical scanner documentation gap (Go routes) that actively destroys trust for senior engineers who verify claims against source code. These are not architectural problems — they are polish and honesty problems that can be fixed in a single focused sprint without touching the core generation pipeline.

What would make it excellent: a single unified quick-start that works end-to-end for a developer with no prior LightSpec exposure, scanner output that honestly reports what it could not detect, a `lsp done <id>` command that makes the daily loop feel like a first-class tool rather than a workaround, and graduation output that is genuinely useful rather than superficially complete. Fixing these five issues would transform the current NPS from -67 to a positive number, because the core value proposition — a grounded spec in under 60 seconds — is real and users who reach it are uniformly positive about it.
