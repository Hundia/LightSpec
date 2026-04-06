---
name: Expert Review 2 — SDD Methodology Expert
type: research
sprint: 40
---

# Expert Review 2 — SDD Methodology Expert

## Reviewer Profile
I am an SDD and software process methodology specialist with 15 years of experience. My background includes agile transformation, DDD, BDD, and AI-assisted development patterns. I have NOT used LightSpec before this review.

---

## Cold Read Summary

My first impression of the AutoSpec/LightSpec ecosystem is of a framework with a sound philosophical core and genuinely novel execution mechanics, wrapped in documentation layers that compound each other's complexity at the point of first contact.

**What strikes me as sound:**

The single-source-of-truth backlog, the emoji-based status state machine, and the model-tiering (haiku/sonnet/opus) reflect real production discipline. These are not invented for the framework — they are hard-won conventions from team development that have been codified and made AI-executable. The Orchestrator + Agent briefing file pattern (`10_orchestrator_agent_pattern.md`) solves a real problem I have observed repeatedly: context drift in long AI sessions. Writing exact values — hex codes, file paths, API routes — into briefing files before spawning agents is exactly correct. Most AI-assisted workflows skip this and pay for it in hallucinated values and inconsistent output.

**What concerns me immediately:**

The 9-role (sometimes 10-role) model is genuinely powerful for teams, genuinely alienating for solo developers. The documentation presents both audiences simultaneously. A junior developer reading `01_philosophy.md` encounters the "English Kef Case Study" and then a 9-role model, when their project might be 3 files. The framework knows this — LightSpec was created to address exactly this tension — but the doc layer hasn't caught up. The philosophy is right; the information architecture is wrong.

**What's novel:**

The brownfield scanner is the most methodologically interesting component. Most spec frameworks treat context as user-supplied input. LightSpec inverts this: it derives context from what already exists, using deterministic filesystem analysis before any LLM call. This is the correct design for brownfield work and represents a genuine contribution to the space. The adaptive depth system (micro/standard/full, scored 0-100 from six dimensions) is a principled answer to the specification paradox — depth proportional to complexity, not developer ambition.

**What's derivative:**

The 9-role model borrows conceptually from DDD's domain experts and Conway's Law team topology literature. The backlog format and sprint ceremonies borrow from Scrum. The model-tiering by task complexity borrows from cost-optimization patterns common in cloud FinOps. None of this is a criticism — synthesizing existing good practice into an AI-executable framework is the correct design approach. The synthesis itself is original work.

**The graduation path is the framework's most important strategic decision:** treating LightSpec as an on-ramp rather than a competitor to AutoSpec is the right call. It acknowledges that methodology adoption is a journey, not a binary switch. The execution of this path (the `lss graduate` command) currently falls short of the concept, but the concept is sound.

---

## Framework Strengths

1. **Orchestrator + Agent Briefing File Pattern:** The design decision to write `agents/sprint-X-brief.md` before spawning subagents — embedding exact file paths, hex values, code snippets, and forbidden patterns into a self-contained context package — is methodologically exceptional. It solves the three key failure modes of multi-agent AI work: context drift, hallucinated values, and sequential bottlenecks. The observation that conventions must be re-stated in every brief (not assumed from a long conversation) reflects genuine understanding of how transformer context windows degrade over long sessions. This pattern is reusable outside LightSpec entirely.
   - Evidence: `10_orchestrator_agent_pattern.md` (cold read); Jordan: "The briefing file approach to prevent context drift is genuinely good engineering that I would apply outside this framework entirely." (persona_c_senior_trial.md)

2. **Adaptive Depth via Deterministic Complexity Scoring:** The six-category complexity scoring algorithm (file count, line count, architecture pattern, tech stack breadth, API+frontend+DB presence, test maturity) provides a principled, reproducible basis for spec depth selection. The score is explainable — a developer can understand why their project got score 42 and depth `standard`. The `--depth` override escape hatch is the correct complement: trust the heuristic by default, override when you know more than the scanner does. No comparable framework in the spec tooling space offers this level of explicit, tunable complexity modeling.
   - Evidence: `04_adaptive_depth.md` (cold read); Sam: "The `--depth` override is the right escape hatch. The scoring algorithm is sound for typical projects." (persona_b_midlevel_trial.md)

3. **Brownfield-First Context Collection:** The scanner's architecture — five detection modules, no LLM calls, pure filesystem analysis, deterministic output — is the correct design for brownfield tooling. Spec generation tools that ask users to describe their own codebase introduce the same ambiguity they're trying to eliminate. The scanner transforms the spec generation prompt from "here is what I say my project is" to "here is what your project verifiably contains." The provider independence (scanner runs with zero API keys) and speed (sub-500ms for up to 500 files) reduce adoption friction significantly.
   - Evidence: `03_scanner.md` (cold read); Alex: "`lsp scan .` is genuinely delightful and I wish it was the first thing the docs showed me." (persona_a_junior_trial.md)

4. **Plan-Sprint Expert Panel Architecture:** The six-phase sprint planning workflow — four parallel domain experts (Architect, UX/UI, Database, Human Experience) followed by three sequential PM passes (Drafter, Reviewer, Finalizer) — embeds adversarial review into the planning process. PM-B's explicit mandate to find issues with PM-A's draft catches rationalization that a single-pass planner would miss. This is structurally superior to any single-agent sprint planning approach. The sequential PM chain produces a sprint plan with documented trade-offs and traceable decisions, which is methodologically more honest than a plan that appears fully formed.
   - Evidence: `skills/claude/plan-sprint.md` (cold read); Sam: "The fact that PM-B adversarially reviews PM-A's draft catches the things a single agent would rationalize away. For sprint planning, this is the most immediately valuable thing in the entire framework." (persona_b_midlevel_trial.md)

5. **Single Source of Truth with Git-Native Traceability:** The `specs/backlog.md` as the canonical work tracker is a principled rejection of external project management tool dependency. The emoji status state machine (🔲→🔄→🧪→✅) is visually efficient and git-diff-friendly — a PR that closes Sprint 4 shows exactly which tickets moved from 🔲 to ✅, creating an audit trail without a separate reporting system. The mandatory `Docs references` linkage between backlog tickets and documentation files creates bidirectional traceability that most teams build informally (or not at all).
   - Evidence: `04_backlog_management.md`, `09_ground_truth_schema.md` (cold read); Jordan: "The emoji status system works well in git diffs. The ticket format is minimal and parseable." (persona_c_senior_trial.md)

6. **FinOps Model Selection as a First-Class Framework Concern:** Explicitly encoding model selection (haiku/sonnet/opus) into every backlog ticket, and providing a decision tree and cost analysis framework, elevates AI cost management from an afterthought to a methodology discipline. The 40/45/15 distribution guideline and the tiered agent pattern (Opus architect, Sonnet builder, Haiku worker) give teams a concrete cost optimization strategy, not just a vague recommendation to "use cheaper models when possible." The test validation results (`08_test_validation_results.md`) report 40% cost savings vs. all-Sonnet approaches.
   - Evidence: `07_model_selection.md` (cold read); Sam: "The FinOps model selection (haiku/sonnet/opus tiering) is exactly the kind of pragmatic advice experienced engineers appreciate." (persona_b_midlevel_trial.md)

7. **Graduation Path Concept:** The one-way LSS → AutoSpec graduation path — where LightSpec is explicitly positioned as an on-ramp rather than a permanent tool — is the correct design response to the methodology adoption problem. Teams need a way to start lightweight and increase process rigor incrementally as project complexity grows. The graduation timing guidance (team grows beyond 3, complexity score consistently 80+, sprint cadence matures) is concrete and actionable rather than vague.
   - Evidence: `06_graduation_path.md` (cold read); Sam: "The graduation path concept is exactly the right design for a team trying to grow into a formal process. I don't have to choose between 'no spec' and 'full AutoSpec ceremony upfront.'" (persona_b_midlevel_trial.md)

---

## Framework Weaknesses

1. **Documentation/Implementation Divergence on Go Route Extraction:** `docs/lss/03_scanner.md` includes an explicit table showing Gin/Echo/Fiber/Chi route detection with regex examples. The actual `detect-routes.ts` contains no `.go` file glob and no `extractGoRoutes()` function — Go routes are never scanned. This is not a missing feature; it is a documented feature that does not exist. In methodology terms, this is a trust debt that compounds: if one documented capability is unimplemented, every other capability claim becomes suspect. For a framework whose value proposition depends on the scanner being a reliable source of ground truth, a documentation/code divergence at this level is a critical integrity issue.
   - Evidence: Jordan traced from `03_scanner.md` documentation table to `detect-routes.ts` source code; confirmed no `.go` glob pattern exists in route detection. (persona_c_senior_trial.md)

2. **Structural Gap Between LSS Output and Skill Layer Input:** The LSS pipeline terminates in `.lsp/tasks.md`. The AutoSpec skill layer (`/execute-ticket`, `/sprint-run`, `/sprint-status`) reads from `specs/backlog.md`. These formats are architecturally incompatible. The only documented bridge is `lsp graduate`, which is framed as a future milestone and currently produces output of inconsistent quality. The consequence: developers following the natural progression (`lsp init` → start building → use skills) encounter an undocumented wall. This is not a documentation gap — it is a pipeline integration failure. The two halves of the framework do not connect.
   - Evidence: Sam: "I had to mentally translate. I ended up manually reformatting tasks into specs/backlog.md. That's a surprising gap given how clean the rest of the pipeline is." (persona_b_midlevel_trial.md); researcher_synthesis.md Category 3 consensus.

3. **The 9-Role/10-Role Model Inconsistency Signals Version Drift:** The methodology documentation consistently describes a 9-role model. The ground truth schema (`09_ground_truth_schema.md`) defines 10 roles including `10_ui_designer.md`. The `graduate.ts` implementation generates files for 10 roles with a different role assignment (07=Security, 08=Data Engineer, 09=Tech Writer, 10=PM) that matches neither the 9-role nor 10-role documentation. This is not a cosmetic discrepancy — it means there is no single authoritative definition of what a valid AutoSpec project structure looks like, which undermines the framework's "single source of truth" philosophy as applied to itself.
   - Evidence: Jordan: "The graduation stubs DevOps as role 06 but Security as role 07 — which doesn't match either the 9-role or 10-role spec definitions. This is a version drift issue." (persona_c_senior_trial.md)

4. **No Human+AI Hybrid Team Model:** The multi-agent documentation models two extremes: a solo developer and an AI orchestrator managing a fleet of AI agents. The 2-5 person team — the most likely early adopter profile for a professional spec-driven development tool — appears nowhere. Questions that go unanswered: how do two humans avoid concurrent `backlog.md` conflicts? How does a human developer mark their own ticket without running through the full skill layer? What happens to shared agent context when a human modifies a file that a running agent is working with? The framework's backlog-as-single-source-of-truth model assumes serial modification, which is incompatible with collaborative development.
   - Evidence: Sam: "The multi-agent pattern is framed entirely around AI agents working in parallel, not human developers working alongside AI agents." (persona_b_midlevel_trial.md); researcher_synthesis.md Category 7.

5. **Scanner Confidence Presentation Does Not Match Detection Confidence:** The `lsp scan` command terminates with "Scan complete ✓" regardless of what it detected or missed. A project with complete JS/TS route extraction and a project with empty Go route extraction receive identical terminal output. `hasApi: false` for a primary HTTP API service is a wrong answer presented with the same visual weight as a correct answer. The framework's spec quality is bounded by scanner accuracy, but scanner accuracy is invisible to the developer. This creates a failure mode where high spec quality (for JS/TS projects) builds trust that then fails silently on polyglot projects.
   - Evidence: Sam: "The scan output currently tells you what it found. It doesn't print what it couldn't detect." Jordan: "The tool shows confidence — 'Scan complete ✓' — without surfacing the gap." (persona_b_midlevel_trial.md, persona_c_senior_trial.md)

6. **Graduate Output Quality Does Not Match the Upgrade Framing:** `lsp graduate` presents itself as promoting a project to full AutoSpec structure. In practice: it generates inapplicable stubs for projects with no frontend/database (Alex found 5 of 10 files essentially empty); the DevOps spec (role 06) is a sparse stub for projects that need Docker and CI configuration (Sam); heading extraction from LLM-generated specs is fragile, with mismatched heading names producing placeholder output that looks like successfully extracted content until read carefully (Jordan); and the generated CLAUDE.md contains a literal unfilled `[Project Name]` placeholder. The gap between the "graduate your project" messaging and the actual output quality erodes trust in the overall framework at a moment that should be a positive milestone.
   - Evidence: All three personas; researcher_synthesis.md Insight 4.

7. **No External Tracker Integration Story:** The framework's backlog-as-single-source-of-truth design implicitly requires teams to abandon Jira, Linear, or GitHub Issues. This is a real adoption blocker for teams with existing process infrastructure. The docs do not acknowledge this switching cost, do not propose integration patterns, and do not suggest a coexistence model. "Everything in backlog.md" is the right design for AI execution context; it is not the right design for stakeholder visibility or team retrospectives that involve non-technical participants. The framework treats this as a solved problem when it is an open one.
   - Evidence: Sam: "Does this replace Jira? The honest answer: yes, intentionally, but without acknowledgment of the switching cost." (persona_b_midlevel_trial.md)

---

## Benchmark Comparison

Compare LightSpec's methodology against comparable frameworks:

| Dimension | LightSpec | BDD (Cucumber/Gherkin) | DDD + Event Storming | GitHub Copilot Workspace | Verdict |
|-----------|-----------|----------------------|---------------------|--------------------------|---------|
| Role model clarity | High — 9/10 roles with explicit ownership and ticket-level assignment | Medium — roles are implicit (product owner, developer, QA) but not formally defined | High — bounded contexts create natural role boundaries, but role assignments are team-defined | Low — no role model; AI generates code from intent | LightSpec wins for AI execution; DDD wins for team alignment at domain level |
| AI integration depth | Very high — model selection per ticket, orchestrator/agent pattern, briefing files, skill layer | Low — AI can generate step definitions from Gherkin but the methodology predates LLM-native design | Low — AI tools can help with event storming but the methodology is human-first | Very high — workspace natively AI-first, intent-to-PR pipeline | LightSpec and Copilot Workspace are the only LLM-native designs; LightSpec has more process scaffolding |
| Adoption curve | High friction — multiple docs, unclear entry point, provider setup required | Low friction — Gherkin syntax is learnable in one session; tooling is mature | High friction — requires facilitation expertise and domain expert availability; 2+ day workshops for non-trivial domains | Low friction — minimal setup, GitHub-native | LightSpec's adoption curve is its primary weakness vs. BDD and Copilot Workspace |
| Team scalability | Medium — solo to ~5 people well-served; 5+ requires custom process design not provided | High — BDD scales to large teams via living documentation and shared scenario ownership | Very high — DDD was designed for large teams; bounded contexts enable team autonomy | Medium — scales with GitHub org but no process scaffolding above PR level | DDD wins for large teams; LightSpec wins for 1-5 person AI-assisted teams |
| Traceability | High — tickets link to docs, docs link to sprints, YAML frontmatter on specs records provenance | High — Gherkin scenarios are executable specifications with test result linkage | Medium — event storming artifacts are often physical/whiteboard-based with no automatic linkage | Low — no traceability beyond PR/commit history | LightSpec and BDD both strong on traceability; LightSpec's git-native approach is simpler to implement |
| Brownfield fit | High (for JS/TS) to Medium (for polyglot) — scanner provides automatic context collection; Go/Rust gaps reduce fit | Low — BDD assumes greenfield test writing; applying retroactively requires significant discipline | Low — event storming is designed for greenfield domain modeling; applying to brownfield requires "model storming" workshops | Medium — GitHub Copilot Workspace can operate on existing code but has no formal brownfield analysis | LightSpec's scanner is the most purpose-built brownfield analysis tool; gaps in non-JS ecosystems reduce the advantage |

---

## Adoption Risk Assessment

| Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
|------|-------------------|----------------|------------|
| Junior developers blocked at provider setup, never see value | H — all three personas encountered provider friction; junior hit hard block | H — if first-run experience is a cryptic error, abandonment is near-certain | Add LightSpec-specific quickstart with provider setup guide and cost context; prioritize `lsp scan` (no API) as the advertised first step |
| Scanner documentation/code divergence erodes trust in senior adopters | M — only triggered on Go/Rust projects, but senior engineers audit claims | H — Jordan explicitly said "this is not a missing feature; it's a documented feature that doesn't exist, which is categorically different" | Either implement Go route extraction (trivial regex work) or add "Known Limitations" callout to scanner docs immediately; do not let the divergence persist |
| Teams abandon post-graduation due to stub quality | H — all three personas evaluated graduation negatively; 3/3 consensus | M — teams may revert to LSS-only or abandon entirely rather than manually completing 5+ stub files | Implement project-type-aware graduation that skips inapplicable roles; auto-fill CLAUDE.md with detected project name and build commands |
| Two-person teams design custom process to fill hybrid human+AI gap | M — teams with existing process will adapt rather than abandon | M — custom process design is time cost; divergent practices reduce reuse of the framework's methodology value | Write a "2-5 person team" workflow guide that explicitly models human ticket ownership alongside AI agent execution |
| Backlog.md drift in collaborative development | H — any team with 2+ concurrent developers faces this; no tooling support | M — stale backlog reduces skill layer effectiveness; teams revert to manual tracking | Add `lsp sync` or `lsp validate-backlog` command; document git-based conflict resolution protocol for concurrent ticket execution |
| Framework version drift accumulates over time (9-role vs 10-role inconsistency) | M — internal inconsistency already present; likely to grow | M — erodes internal documentation credibility; confuses teams trying to establish correct project structure | Establish a single authoritative role schema document; run consistency audit against all methodology docs and CLI source; add schema version to generated artifacts |
| Provider lock-in perception from Claude-centric documentation | M — FinOps tiering uses haiku/sonnet/opus names; OpenAI equivalents not mapped | L — teams using OpenAI or Gemini face friction in model assignment | Add provider equivalency table to model selection docs (claude haiku ≈ GPT-4o-mini ≈ Gemini Flash; sonnet ≈ GPT-4o ≈ Gemini Pro; opus ≈ GPT-o1 ≈ Gemini Ultra) |

---

## Priority Improvement Areas (ranked 1–10)

Based on cold read and study data, ranked by importance:

| Rank | Area | Evidence Source | Effort (S/M/L) | Impact (H/M/L) |
|------|------|----------------|----------------|----------------|
| 1 | LightSpec standalone quickstart with install instructions, tool selection criteria, and provider setup | Alex (sev 5 blocker), Sam (sev 2), researcher synthesis Category 1 | S | H |
| 2 | LSS-to-skill-layer bridge (either `lsp init-backlog` command or documented `lsp graduate` prerequisite) | Sam (sev 4), Jordan (sev 3), researcher synthesis Insight 2 | M | H |
| 3 | Go route extraction implementation or honest documentation of the gap | Jordan (sev 4, source-code verified), researcher synthesis Category 4 | S (docs) / M (implementation) | H |
| 4 | Scanner confidence output — surface missing/low-confidence signals | Sam (sev 3), Jordan (sev 4), researcher synthesis Insight 3 | M | H |
| 5 | Graduate output quality — skip inapplicable roles, fill CLAUDE.md placeholder, add --dry-run | Alex (sev 3), Sam (sev 3), Jordan (sev 3), researcher synthesis Insight 4 | M | H |
| 6 | `lsp done <task-id>` CLI command to replace manual markdown table editing | Alex (sev 2), Jordan (sev 2), researcher synthesis Category 6 | S | M |
| 7 | 2-5 person hybrid human+AI workflow guide | Sam (sev 4), Jordan (sev 3), researcher synthesis Category 7 | M | H |
| 8 | Role schema reconciliation — single authoritative model count (9 vs. 10) across all docs and graduate.ts | Jordan (cold read + source audit), researcher synthesis Category 5 | S | M |
| 9 | Provider equivalency table for non-Claude providers (OpenAI, Gemini model tier mapping) | Sam (sev 2 implicit), researcher synthesis Category 2 | S | M |
| 10 | External tracker integration story (how backlog.md coexists with Jira/Linear/GitHub Issues) | Sam (sev 4), researcher synthesis Category 7 | M | M |

---

## Specific Actionable Recommendations

1. **Create a `LIGHTSPEC_QUICKSTART.md` as the canonical entry point for new users:**
   This document should contain exactly four things: (1) `npm install -g lightspec` — the install command absent from all current markdown docs; (2) a tool selection decision tree ("solo dev or small project? → LightSpec. Team >3 with SRS? → AutoSpec"); (3) a provider setup guide covering the three supported paths (Claude Code, Anthropic API key, Gemini API key) with cost context ("Gemini free tier supports ~60 spec generations/day"); (4) a minimal three-command quickstart (`lsp scan .`, `lsp init .`, `lsp status`). This document should be the README for the `lsp` CLI package and the first link in QUICKSTART.md. AutoSpec-specific workflows should not appear in this document.
   - Effort: S
   - Expected impact: Resolves the single largest first-run blocker across all experience levels; converts the "No LLM provider available" hard stop into a guided setup flow.

2. **Implement `lsp init-backlog` as a lightweight bridge between LSS and the skill layer:**
   This command should read `.lsp/tasks.md` and generate a minimal `specs/backlog.md` in AutoSpec format — Sprint 1 structure, model assignments defaulting to `sonnet`, ownership defaulting to `Fullstack`. It should not require full graduation. The goal is to let developers use `/execute-ticket` and `/sprint-run` immediately after `lsp init` without committing to 10-role spec expansion. The migration path becomes: `lsp init` → `lsp init-backlog` → use skills → optionally `lsp graduate` later. This closes the structural handshake failure at the framework's midpoint.
   - Effort: M
   - Expected impact: Eliminates the highest-severity structural gap identified by mid-level and senior personas; makes the full skill layer accessible to LightSpec-entry users without requiring graduation.

3. **Add confidence reporting to `lsp scan` output:**
   After the "Scan complete ✓" summary, emit a "Detection Confidence" section that distinguishes between high-confidence signals (manifest file parsing) and low-confidence signals (directory heuristics, route extraction). For any framework or capability listed as "not detected," note whether the absence is confirmed (e.g., "No package.json found — JavaScript/TypeScript not present") or uncertain (e.g., "Go routes: NOT DETECTED — Go route extraction is not currently supported; consider using --srs to provide route documentation"). This directly addresses Jordan's observation that the scanner presents partial results with the same confidence as complete results.
   - Effort: M
   - Expected impact: Eliminates the trust failure mode for polyglot teams; provides Jordan-type engineers with the information needed to calibrate spec quality without reading source code.

4. **Implement project-type-aware graduation in `lsp graduate`:**
   Before generating the 10 role spec files, read the `.lss/.meta.json` (which records the scan result) and skip roles for which there is no detected presence. A project with `hasFrontend: false` should not produce `03_frontend_lead.md`. A project with `hasDatabase: false` should not produce `04_db_architect.md`. At minimum, add a `--roles` flag to allow explicit selection: `lsp graduate --roles=pm,backend,qa`. Additionally: auto-substitute `path.basename(process.cwd())` for the `[Project Name]` placeholder in the generated CLAUDE.md. Add a `--dry-run` mode that prints the extraction mapping before writing files. These are separable changes; the placeholder fix is one line and should ship immediately.
   - Effort: M
   - Expected impact: Graduation output goes from "10 files where half are empty stubs" to "5-7 relevant files with actual content"; CLAUDE.md placeholder fix eliminates the most universal quality signal identified across all three personas.

5. **Add a `lsp done <task-id>` command to eliminate manual markdown table editing:**
   The current workflow requires developers to open `.lsp/tasks.md`, find the correct table row, and edit the status cell — a workflow that silently breaks if the table formatting is off by one pipe character. A `lsp done 3` command that programmatically marks task #3 complete, with correct table syntax, would eliminate this daily friction for all users and prevent silent parser failures. This is approximately two hours of implementation work for disproportionate daily-interaction improvement.
   - Effort: S
   - Expected impact: Eliminates the primary daily friction point for task management; prevents silent data loss from table formatting errors; makes the tool feel more like a professional CLI and less like a markdown workaround.

---

## Draft Sprint 41 Tickets (3–5)

### Ticket: LightSpec Standalone Quickstart Document

- **Owner:** Docs
- **Model:** sonnet
- **Points:** 2
- **Description:** Create `LIGHTSPEC_QUICKSTART.md` as the canonical entry point for new LightSpec users. Include install command (`npm install -g lightspec`), tool selection criteria (LightSpec vs. AutoSpec), all three provider setup paths with cost context, and a three-command quickstart. Link from the main QUICKSTART.md's first section. Remove any AutoSpec-specific workflow content from this document.
- **Acceptance Criteria:**
  - [ ] Document begins with `npm install -g lightspec` as its first command
  - [ ] Contains a two-path decision tree: LightSpec (solo/small/brownfield) vs. AutoSpec (team/greenfield/SRS available)
  - [ ] Covers all three provider setup paths: Claude Code CLI, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` — each with a one-line cost note
  - [ ] Three-command quickstart (`lsp scan .`, `lsp init .`, `lsp status`) produces working output
  - [ ] No AutoSpec-specific commands (`/sprint-run`, `/execute-ticket`, `sdd init`) appear in the document
  - [ ] QUICKSTART.md links to this document as its first heading for LightSpec users

---

### Ticket: `lsp init-backlog` — Bridge Command LSS to Skill Layer

- **Owner:** CLI
- **Model:** sonnet
- **Points:** 3
- **Description:** Implement `lsp init-backlog` as a new CLI command that converts `.lsp/tasks.md` to a minimal `specs/backlog.md` in AutoSpec Sprint 1 format. Model assignments default to `sonnet`; ownership defaults to `Fullstack`. The command should be documented in the LightSpec quickstart as the bridge step between `lsp init` and using Claude Code skills. This eliminates the undocumented structural gap between the LSS pipeline and the skill layer.
- **Acceptance Criteria:**
  - [ ] `lsp init-backlog` reads `.lsp/tasks.md` and converts all task rows to Sprint 1 ticket format
  - [ ] Generated `specs/backlog.md` passes validation by `/sprint-status` skill
  - [ ] Model column defaults to `sonnet`; owner column defaults to `Fullstack`
  - [ ] Command exits with an informative error if `.lsp/tasks.md` does not exist (run `lsp init` first)
  - [ ] Does not require or trigger full graduation
  - [ ] `LIGHTSPEC_QUICKSTART.md` documents this as step 4 in the quickstart flow

---

### Ticket: Scanner Confidence Output — Surface Detection Gaps

- **Owner:** CLI
- **Model:** sonnet
- **Points:** 3
- **Description:** Add a "Detection Confidence" section to `lsp scan` output (and `lsp init` pre-generation display) that distinguishes confirmed-present, confirmed-absent, and undetected signals. For any capability with known limitations (e.g., Go/Rust/Ruby route extraction), emit an explicit low-confidence or not-supported note. Add a "Known Limitations" section to `docs/lss/03_scanner.md` that documents unsupported languages for route extraction. This is a two-part change: CLI output and documentation.
- **Acceptance Criteria:**
  - [ ] `lsp scan` output includes a confidence section after the summary, with at minimum: Stack (CONFIRMED/INFERRED), Routes (DETECTED/NOT_DETECTED/NOT_SUPPORTED), API presence (HIGH/LOW/UNKNOWN confidence)
  - [ ] For Go, Rust, or Ruby projects, route detection section reads "NOT SUPPORTED — route extraction requires manual --srs input for these languages"
  - [ ] `docs/lss/03_scanner.md` gains a "Known Limitations" section explicitly listing unsupported languages for each scanner module
  - [ ] The Gin/Echo/Fiber/Chi row in the frameworks table is either (a) implemented or (b) marked as "detection only (routes not extracted)"
  - [ ] `lsp scan --json` output includes a `confidence` field per detection category

---

### Ticket: `lsp graduate` — Project-Type-Aware Role Generation with Dry Run

- **Owner:** CLI
- **Model:** sonnet
- **Points:** 5
- **Description:** Modify `lsp graduate` to skip generating role spec files for which the project has no detected presence (`hasFrontend: false` skips `03_frontend_lead.md`, `hasDatabase: false` skips `04_db_architect.md`). Auto-substitute the project directory name for the `[Project Name]` placeholder in CLAUDE.md. Add `--dry-run` mode that prints the extraction plan (which roles will be generated, what content was extracted, where fallback placeholders will appear) without writing any files. Add a confirmation prompt before overwriting an existing CLAUDE.md.
- **Acceptance Criteria:**
  - [ ] `lsp graduate` reads `.lss/.meta.json` scan context and skips role files for undetected concerns
  - [ ] Generated CLAUDE.md contains `path.basename(process.cwd())` where `[Project Name]` currently appears
  - [ ] `lsp graduate --dry-run` prints extraction plan with confidence per role section: "EXTRACTED (8 lines from 'Technical Design' heading)", "FALLBACK (no matching heading found)", "SKIPPED (hasFrontend: false)"
  - [ ] If `CLAUDE.md` already exists, graduate prompts: "CLAUDE.md already exists. Overwrite? [y/N]" before writing
  - [ ] A project with only `hasApi: true` (no frontend, no database) generates exactly 3 content files (01, 02, 05) plus stubs only for roles with clear presence evidence

---

### Ticket: `lsp done <task-id>` — CLI Task Completion Command

- **Owner:** CLI
- **Model:** haiku
- **Points:** 1
- **Description:** Implement `lsp done <task-id>` as a new CLI command that programmatically marks the specified task as complete in `.lsp/tasks.md` by writing the correct table syntax (setting the Done column to `[x]`). This replaces the current workflow of manually editing the markdown table row. Include validation that the task ID exists and an error message if the task is already marked done.
- **Acceptance Criteria:**
  - [ ] `lsp done 3` marks task #3 as `[x]` in `.lsp/tasks.md` Done column
  - [ ] Command prints confirmation: "Task 3 marked complete: [task description]"
  - [ ] Command exits with helpful error if task ID does not exist: "Task 3 not found. Run `lsp status` to see available task IDs."
  - [ ] Command exits with informative message if task already done: "Task 3 is already complete."
  - [ ] `lsp status` reflects the change immediately after `lsp done` is run

---

## Team Adoption Assessment

**At what team size and maturity does LightSpec make sense?**

LightSpec is correctly positioned for 1-3 person teams working on brownfield Node.js/TypeScript projects, or teams evaluating spec-driven development before committing to full AutoSpec overhead. The `lsp scan` + `lsp init` pipeline provides genuine value at this scale: a grounded spec in 45 seconds is a meaningful improvement over no spec, or over a PRD written in Notion and copy-pasted into a chat window.

**The ideal adopter profile is:**
- A developer or small team already using Claude Code or Anthropic API (provider friction is pre-solved)
- Working on a Node.js/TypeScript or Python project (scanner coverage is strongest here)
- Wanting to improve AI-assisted development quality without adopting a full sprint ceremony framework
- Open to git-native tooling as the primary project management interface

**Red flags indicating a team is NOT ready for LightSpec:**

1. **Primary backend is Go, Rust, or Ruby.** The scanner's route extraction and API presence detection are substantially incomplete for these languages. The generated spec will describe the frontend correctly and the backend incorrectly or not at all. Using LightSpec without understanding this limitation will produce false confidence in a spec that misrepresents the most important part of the system.

2. **Team size is 5+ people with existing Jira/Linear adoption.** The backlog.md as single source of truth requires either migrating stakeholder visibility to markdown files in git (a non-trivial organizational change) or maintaining two systems indefinitely. Neither is sustainable above 5 people without a formal integration story that does not yet exist.

3. **Team is in regulated or audited development environment.** The spec generation and backlog management tooling produces artifacts that are useful for developer execution but not designed for compliance review, sign-off workflows, or audit trails that involve non-engineering stakeholders.

4. **The team lead expects the framework to configure itself.** Despite the "zero config" narrative, LightSpec requires LLM provider credentials, and the skill layer requires graduation or a manual bridge step. Teams that adopt the tool expecting true zero-setup will encounter multiple friction points that require documentation-reading to resolve.

5. **The team is junior-dominated without an experienced process owner.** The framework documentation assumes a reader who can navigate ambiguity, cross-reference docs, and fill in methodology gaps with judgment. Junior developers following the documentation literally will hit provider setup blockers, unclear graduation timing, and the tasks.md/backlog.md gap without the context to resolve them independently.

---

## Overall Assessment

LightSpec's methodology design has a sound philosophical foundation and two genuinely strong components — the brownfield scanner and the orchestrator+agent briefing file pattern — that represent original contributions to AI-assisted development practice. The framework correctly identifies the specification paradox (too much spec kills velocity; too little kills quality) and provides a principled mechanism (adaptive depth scoring) to navigate it. The graduation path concept is the right design response to the methodology adoption problem, and the FinOps model selection framework elevates cost management from operational concern to methodology discipline.

The framework's biggest methodological opportunity is closing the structural gap between its lightweight entry point and its full execution layer. LightSpec and AutoSpec should form a single continuous pipeline, not two separate tools with an undocumented handshake failure in the middle. If `lsp init` → `lsp init-backlog` → skill layer → `lsp graduate` → full AutoSpec becomes a documented, tested, frictionless path, the framework can credibly serve the full spectrum from solo developer on day one to 10-person team on month six.

What would make this framework excellent for teams is three things: honest scanner output (including confidence levels and documented limitations), a team workflow guide that models hybrid human+AI development rather than AI-agent-only parallelism, and a graduation output that delivers on its "upgrade" promise rather than producing half-empty stubs. The core design is defensible; the execution gaps are closeable; the framework deserves the investment required to close them.
