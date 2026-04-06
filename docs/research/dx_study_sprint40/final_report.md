---
name: Sprint 40 DX Study — Final Report
type: research
sprint: 40
---

# Sprint 40 DX Usability Study — Final Report

## Executive Summary

The Sprint 40 DX usability study evaluated the LightSpec/AutoSpec framework through three developer personas (junior, mid-level, senior), a UX researcher synthesis, and two independent expert reviews (DX Tooling, SDD Methodology). The simulated NPS is **-67** (0 promoters, 1 passive, 2 detractors out of 3 respondents).

The framework has a defensible, differentiated core that all six sources agree on: the brownfield scanner (fast, free, accurate for JS/TS), the adaptive depth system (micro/standard/full), and the orchestrator+agent briefing file pattern are genuine contributions to developer tooling. The generated spec quality, when the scanner has full coverage, is consistently rated as the product's best output. Sam called it "better than the 45 minutes it takes us to write a PRD in Notion." Alex called `lsp scan .` "genuinely delightful." Jordan rated the orchestrator pattern 9/10 — the highest component score in the entire study.

The three things that must change, in priority order:

1. **The onboarding path is broken.** There is no standalone LightSpec quick-start document. Install instructions (`npm install -g lightspec`) appear only in the guide web app, not in any markdown documentation. The LLM provider requirement is undisclosed until a cryptic error at first run. Junior developers are completely blocked; all three personas experienced onboarding confusion. This is the primary driver of the -67 NPS.

2. **The LSS-to-skill pipeline has a structural handshake failure.** `lsp init` produces `.lsp/tasks.md`. The skill layer (`/execute-ticket`, `/sprint-run`) reads `specs/backlog.md`. These two formats are incompatible, and no bridge command exists. The only documented path is `lsp graduate`, which is framed as a future milestone and produces output of inconsistent quality. This gap blocks the framework's primary value delivery mechanism.

3. **The scanner presents partial results with uniform confidence.** Go route extraction is documented as implemented but does not exist in the source code. `hasApi` detection fails for non-conventional directory structures. The scan output shows "Scan complete" with no indication of what was missed. This is the single most consequential trust problem for senior engineers and polyglot teams.

## Cross-Study Convergence Analysis

**Universal agreement (all 6 sources):**
- The brownfield scanner is the framework's strongest asset for JS/TS projects
- The orchestrator+agent briefing file pattern is production-grade systems thinking
- Onboarding documentation is fragmented and sends users to the wrong tool first
- The `lsp graduate` command produces output that does not match its "upgrade" framing
- The LLM provider requirement is insufficiently documented
- The CLAUDE.md `[Project Name]` placeholder is unfilled (universal low-severity polish signal)

**Strong agreement (5/6 sources):**
- A `lsp done <id>` command is needed to replace manual markdown table editing
- Scanner confidence signals must be added to distinguish what was detected from what was missed
- The LSS-to-skills gap needs a bridge command (`lsp init-backlog`)

**Partial agreement (3-4/6 sources):**
- Team workflow guide for 2-5 person hybrid human+AI teams (raised by Sam, Jordan, both reviewers; not relevant to Alex's solo context)
- Go route extraction needs implementation or honest documentation (raised by Jordan, both reviewers, researcher; not encountered by Alex/Sam on JS/TS projects)

**Divergence:**
- External tracker integration (Jira/Linear): only Sam raised this as a 4/5 severity concern; others did not encounter or prioritize it. This is a real adoption blocker for teams but is out of scope for Sprint 41's focus on core pipeline fixes.
- Plan-sprint ceremony overhead: Jordan found it over-engineered for 2-person teams; Sam found it "the most immediately valuable thing in the entire framework." This reflects different team sizes, not a product problem.

**What convergence tells us about priority:** The issues that appear across all experience levels (onboarding, graduate quality, provider setup) are higher-priority than issues that appear only at senior level (Go routes, scanner confidence). However, the Go route documentation divergence is categorically different from other issues — it is a false capability claim — and must be addressed for framework integrity regardless of frequency.

## Severity x Effort Matrix

| Rank | Improvement | Severity (1-5) | Frequency | Effort | Evidence | Sprint 41? |
|------|-------------|----------------|-----------|--------|----------|------------|
| 1 | LightSpec standalone quick-start document with install + provider setup | 5 | 3/3 personas + both reviewers + researcher | S | Alex sev-5 blocker; researcher Category 1+2; Reviewer 1 Priority #1; Reviewer 2 Priority #1 | Yes |
| 2 | `lsp init-backlog` bridge command (LSS to skill layer) | 4 | 2/3 personas + both reviewers + researcher | M | Sam sev-4; researcher Insight 2; Reviewer 1 Priority #3; Reviewer 2 Priority #2 | Yes |
| 3 | Go route extraction: implement `extractGoRoutes()` | 4 | 1/3 personas + both reviewers + researcher | M | Jordan sev-4 source-verified; Reviewer 1 Priority #2; Reviewer 2 Priority #3; researcher Category 4 | Yes |
| 4 | Scanner confidence signals in `lsp scan` output | 4 | 2/3 personas + both reviewers + researcher | M | Sam sev-3, Jordan sev-4; Reviewer 1 Priority #4; Reviewer 2 Priority #4; researcher Insight 3 | Yes |
| 5 | `lsp done <id>` CLI command | 2 | 2/3 personas + both reviewers + researcher | S | Alex sev-2, Jordan sev-2; Reviewer 1 Priority #6; Reviewer 2 Priority #6; researcher Category 6 | Yes |
| 6 | `lsp graduate` project-type-aware role filtering + CLAUDE.md placeholder fix | 3 | 3/3 personas + both reviewers + researcher | M | All personas sev-3; researcher Insight 4; Reviewer 1 Priority #5; Reviewer 2 Priority #5 | Yes |
| 7 | Provider error message with recovery instructions + cost context | 5 | 3/3 personas + both reviewers | S | Alex sev-5; Reviewer 1 risk assessment "H likelihood, H impact" | Yes (part of ticket #1) |
| 8 | CLI flag reference page (--yes, --dry-run, --scope, --srs, --provider, --model) | 3 | 2/3 personas + Reviewer 1 | S | Alex sev-4, Sam sev-2, Jordan sev-2; Reviewer 1 Priority #8 | Yes (part of ticket #1) |
| 9 | `lsp status` path resolution: upward directory search + `--dir` flag | 2 | 3/3 personas | S | Alex sev-3, Sam sev-2, Jordan sev-2; researcher Category 6 | Yes (part of ticket #5) |
| 10 | 2-5 person hybrid human+AI team workflow guide | 4 | 2/3 personas + both reviewers | M | Sam sev-4, Jordan sev-3; Reviewer 2 Priority #7 | No — Sprint 42 |
| 11 | Provider equivalency table (Claude/OpenAI/Gemini model tiers) | 2 | 1/3 personas + Reviewer 2 | S | Sam sev-2 implicit; Reviewer 2 Priority #9 | No — Sprint 42 |
| 12 | Role schema reconciliation (9-role vs 10-role across docs and graduate.ts) | 2 | 1/3 personas + Reviewer 2 | S | Jordan sev-2; Reviewer 2 Priority #8 | No — Sprint 42 |
| 13 | Monorepo workflow guide (--scope usage, per-app specs) | 3 | 2/3 personas | M | Sam sev-3, Jordan sev-2; researcher Category 6 | No — Sprint 42 |
| 14 | External tracker integration story (Jira/Linear/GitHub Issues coexistence) | 4 | 1/3 personas | L | Sam sev-4; Reviewer 2 weakness #7 | No — Future |
| 15 | Incremental spec update (partial regeneration without full re-run) | 3 | 2/3 personas | L | Sam sev-3, Jordan sev-3; researcher issue frequency table | No — Future |

## Evidence Citations

### #1: LightSpec Standalone Quick-Start with Install + Provider Setup

- **Alex's experience:** "Couldn't find any install command for the `lsp` CLI. The QUICKSTART talks about 'tell your AI' and paste steps, not a CLI install. Searched for 'npm install' in the doc -- not present." (Severity 5, blocker.) Also: "Nowhere in any of the docs I read is there a plain step saying 'if you use VS Code + Copilot, here is how to get an API key for the LLM that lsp init needs.'" (Severity 5.)
- **Sam's experience:** "Package name is `lightspec` but the binary is `lsp` -- this is fine, but the README and QUICKSTART use `lsp` while the package name doesn't obviously match." (Severity 2.) Provider confirmation shown after user says Y, not before.
- **Jordan's experience:** `--yes` flag for non-interactive mode undocumented in onboarding guides. Provider error message "No LLM provider available" with `process.exit(1)` -- no actionable recovery steps.
- **Researcher finding:** "The onboarding layer is implicitly designed for someone who already knows which tool they need and how to set up an LLM provider." Category 1 consensus: "There is no single authoritative 'start here' artifact for LightSpec."
- **Reviewer 1 finding:** "The entry point documentation sends users to the wrong tool." Priority #1. "Eliminates the first-30-minutes blocker for all experience levels; removes the primary driver of the -67 NPS score."
- **Reviewer 2 finding:** Priority #1. "Resolves the single largest first-run blocker across all experience levels; converts the 'No LLM provider available' hard stop into a guided setup flow."

### #2: `lsp init-backlog` Bridge Command

- **Alex's experience:** Not directly encountered (never reached skill layer), but observed graduation disconnect: "That makes graduate feel premature for my use case."
- **Sam's experience:** "The skill is designed for a project that already has a `specs/` directory and a `backlog.md` in AutoSpec format. My LSS output was in `.lsp/`. I had to mentally translate... I ended up manually reformatting a few tasks from `tasks.md` into a `specs/backlog.md` so the skill could read them." (Severity 4.)
- **Jordan's experience:** Noted the viewer dependency in `sprint-run` as structural: "The sprint-run skill would either fail or require the user to skip those phases manually."
- **Researcher finding:** Insight 2: "The framework's adoption funnel has a critical gap between its lightweight entry tool and its primary value delivery mechanism." "Every developer who follows the natural progression from `lsp init` to `/execute-ticket` will hit this wall."
- **Reviewer 1 finding:** "The pipeline between LightSpec output and the skill layer is broken without documentation." Priority #3: "Mid-level and above developers can use the skill layer immediately after `lsp init`."
- **Reviewer 2 finding:** Priority #2: "Eliminates the highest-severity structural gap identified by mid-level and senior personas; makes the full skill layer accessible to LightSpec-entry users without requiring graduation."

### #3: Go Route Extraction

- **Alex's experience:** Not applicable (JS project).
- **Sam's experience:** Not applicable (JS/TS project), but noted the broader scanner confidence issue: "The scan output currently tells you what it found. It doesn't print what it couldn't detect."
- **Jordan's experience:** Source-code verified: "Go is not in this primary resolution chain at all. There is no `extractGoRoutes()` function in the actual source. The documentation describes Go framework detection but the route extraction code never scans `.go` files." (Severity 4.) "This is not a missing feature; it is a documented feature that is not implemented, which is categorically different."
- **Researcher finding:** Category 4: "The scanner's confidence presentation does not match its detection confidence." Ranked as the single highest average severity (4.0) in the issue frequency table despite appearing in only 1/3 personas.
- **Reviewer 1 finding:** "Go route extraction is documented as implemented but is not. This is categorically worse than a missing feature -- it is a false capability claim." Priority #2.
- **Reviewer 2 finding:** "In methodology terms, this is a trust debt that compounds: if one documented capability is unimplemented, every other capability claim becomes suspect." Priority #3.

### #4: Scanner Confidence Signals

- **Alex's experience:** Architecture reported as "unknown" for a flat `src/` structure with no differentiated treatment. (Implicit, not raised as a discrete concern.)
- **Sam's experience:** "The scan output currently tells you what it found. It doesn't print what it couldn't detect. For a brownfield project where routes are dynamically registered, the route list will be incomplete -- but you won't know that." (Severity 3.) "As a team lead I want a 'low-confidence signals' section."
- **Jordan's experience:** "`hasApi: false` is produced for a project whose primary purpose is HTTP API serving, because the Go backend lives in `backend/` rather than a directory name in the `apiDirSignals` list." (Severity 4.) "The tool shows confidence -- 'Scan complete' -- without surfacing the gap."
- **Researcher finding:** Insight 3: "All three personas identified scanner output that presented partial or incorrect results with the same visual treatment as complete and accurate results."
- **Reviewer 1 finding:** "The scanner presents partial results with uniform confidence." Priority #4: "Prevents the 'false confidence' trust problem identified by both Sam and Jordan."
- **Reviewer 2 finding:** Priority #4: "Eliminates the trust failure mode for polyglot teams; provides senior engineers with the information needed to calibrate spec quality without reading source code."

### #5: `lsp done <id>` Command

- **Alex's experience:** "There is no CLI command like `lsp done 3` to mark task #3 complete without touching the file." (Severity 2.) Also noted that "if the table formatting is off by one pipe character, the regex parser in `status.ts` silently drops the task."
- **Sam's experience:** Implicit -- raised the concurrent-access concern but did not note `lsp done` specifically.
- **Jordan's experience:** "No `lsp status --tasks <path>` flag to point at a custom tasks file." (Severity 2.)
- **Researcher finding:** Category 6: "The lack of a `lsp done <id>` command is the most universally noted gap."
- **Reviewer 1 finding:** Priority #6: "Eliminates the most commonly noted daily friction point; removes silent failures that look like tool bugs to new users."
- **Reviewer 2 finding:** Priority #6: "This is approximately two hours of implementation work for disproportionate daily-interaction improvement."

## Implementation Timeline Recommendation

### Sprint 41 (this sprint): Core Pipeline Fixes — 35 pts

The critical path is: onboarding unblocks first-run experience, then init-backlog bridges the pipeline, then scanner improvements build trust. The recommended sequencing:

**Wave 1 (parallel, no dependencies):**
- LightSpec quick-start document (unblocks all first-run users)
- Go route extraction implementation (restores scanner trust)
- `lsp done <id>` command (daily friction removal)

**Wave 2 (depends on scanner work from Wave 1):**
- Scanner confidence signals (builds on route extraction work; requires understanding of what the scanner can and cannot detect)
- `lsp init-backlog` bridge command (connects LSS output to skill layer)

**Wave 3 (depends on init-backlog):**
- `lsp graduate` improvements (role filtering, CLAUDE.md fix, dry-run mode; depends on understanding what init-backlog covers vs. what graduation adds)
- Provider error message improvements (folded into quick-start doc ticket)

### Sprint 42 (next sprint): Team Adoption + Polish
- 2-5 person team workflow guide
- Provider equivalency table (Claude/OpenAI/Gemini)
- Role schema reconciliation (9 vs 10 roles)
- Monorepo workflow guide

### Future (Sprint 43+):
- External tracker integration (Jira/Linear/GitHub Issues)
- Incremental spec update capability
- Custom complexity scoring weights (`.lssrc.json`)
- Plugin API for custom route extractors

## What NOT to Change

The study confirmed these components are working well and should be protected:

1. **The brownfield scanner architecture for JS/TS.** All three personas and both reviewers rated the scan engine highly. The five parallel ecosystem detectors, deterministic scoring, and sub-500ms execution are the framework's strongest differentiator. Do not restructure the scanner modules; extend them (Go routes) while preserving the existing detection quality.

2. **The orchestrator + agent briefing file pattern.** Jordan rated it 9/10 -- the highest component score in the study. Sam called it "genuinely sophisticated." The insight that context drift is solved by writing exact values into briefing files before spawning agents is a portable best practice. This pattern should not be simplified or abstracted away.

3. **The adaptive depth system (micro/standard/full).** The six-category complexity scoring with a `--depth` override escape hatch is "the right design" (Sam). The scoring algorithm is deterministic and explainable. Do not change the scoring weights or depth thresholds in Sprint 41.

4. **The `plan-sprint` expert panel architecture.** Sam called it "the most immediately valuable thing in the entire framework." The 4-parallel-expert + 3-sequential-PM structure provides adversarial quality control. Do not simplify the planning pipeline.

5. **The Handlebars template + XML constraint prompt system.** The `<constraints>` XML tags and explicit `<output_format>` sections produce consistent, bounded LLM output. The brownfield context JSON injection is "why the generated spec quality is noticeably above what you'd get from a generic prompt" (Sam). Do not restructure the prompt templates.

6. **The emoji status state machine in backlog.md.** Jordan: "works well in git diffs." The visual efficiency and parseability of the status system should be preserved.

7. **The `lsp scan` as a free, zero-API-key first step.** Alex: "genuinely delightful." The cost-free scan as the entry point is the correct onboarding design. Do not add any API requirement to the scan command.

8. **The graduation path concept.** The idea that LSS is an on-ramp to AutoSpec is "exactly the right design for a team trying to grow into a formal process" (Sam). The concept is sound; only the execution needs improvement. Do not change the one-way graduation direction or the timing guidance.
