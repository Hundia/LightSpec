# Plan Sprint

Assemble a team of expert AI agents to collaboratively plan a sprint before building it. Experts analyze the goal in parallel, then three PMs (drafter → reviewer → finalizer) produce a production-ready sprint plan for the backlog.

## Usage

```
/plan-sprint [goal description]
```

**Examples:**
- `/plan-sprint Add lsp init --watch mode that re-generates spec on file changes`
- `/plan-sprint Improve brownfield scanner accuracy with AST-based route detection`
- `/plan-sprint Build VS Code extension wrapping lsp init and lsp status`

## Instructions

When this command is invoked, execute the 6-phase planning workflow below. The argument `$ARGUMENTS` is the sprint goal description.

---

### Phase 1: Goal Analysis & Expert Selection

1. **Validate the goal.** If `$ARGUMENTS` is empty or too vague (fewer than 5 words, no clear deliverable), ask the user to clarify:
   ```
   I need a clearer sprint goal. Please describe:
   - What feature/fix/improvement you want
   - Who it's for (which user personas)
   - Any specific subsystems involved

   Example: "Improve lsp init to detect Go projects and generate Go-specific specs"
   ```

2. **Read `specs/backlog.md`** — scan all `## Sprint X` headers to determine the next sprint number.

3. **Read `docs/` index** — identify which subsystems the goal touches.

4. **Determine which experts to activate** based on the goal:

   | Expert | Role | Activate When | Reads |
   |--------|------|---------------|-------|
   | **Architect** | System design, API contracts, integration | ALWAYS | `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, project entry points, relevant `docs/` |
   | **UX/UI Expert** | User flows, components, accessibility | Sprint has ANY frontend/presentation/viewer work | `specs/10_ui_designer.md` |
   | **Storage Expert** | File output structure, .lsp/ format | Sprint has output format changes | `specs/04_db_architect.md` |
   | **Human Experience Expert** | User journeys, personas, cognitive load | Sprint has user-facing features | `specs/01_product_manager.md` |

5. **Announce the plan** to the user:
   ```
   ## Sprint [N] Planning: [Goal Title]

   ### Activated Experts
   | Expert | Reason |
   |--------|--------|
   | Architect | [why] |
   | UX/UI | [why, or "Skipped — no frontend work"] |
   | Storage | [why, or "Skipped — no output format changes"] |
   | Human Experience | [why, or "Skipped — no user-facing features"] |

   ### Subsystems Affected
   [List of docs/ sections that will be consulted]

   Starting expert analysis...
   ```

---

### Phase 2: Expert Analysis (PARALLEL)

Launch all activated experts simultaneously as **parallel Task agents**. Each expert reads its assigned spec files and docs, then produces a structured analysis.

**IMPORTANT:** Run all expert agents in parallel — they are independent of each other.

#### Architect Agent

Reads: `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, project entry points, relevant `docs/` sections.

Produces:
- **System Impact Assessment** — new/modified modules, cross-module dependencies
- **CLI Design** — command signature, flags, options
- **File Structure** — proposed new/modified files
- **Technical Approach** — step-by-step implementation plan
- **Integration Points** — how this connects to existing scanner/pipeline/commands
- **Risks & Mitigations** — risk table with impact and mitigation
- **Estimated Complexity** — complexity rating + total points estimate

#### UX/UI Expert (when activated)

Reads: `specs/10_ui_designer.md`.

Produces:
- **User Flows** — step-by-step or Mermaid flowchart for each new/modified flow
- **Component Design** — table of new/modified components with props
- **Accessibility Requirements** — ARIA, keyboard nav, color contrast
- **i18n Keys Needed** — new translation keys for EN/HE data files

#### Storage Expert (when activated)

Reads: `specs/04_db_architect.md`.

Produces:
- **Output Format Changes** — `.lsp/` directory additions or modifications
- **Frontmatter Changes** — new YAML fields in `spec.md`
- **Migration Plan** — how existing `.lsp/` directories are handled
- **Backward Compatibility** — can old `.lsp/` files still be read

#### Human Experience Expert (when activated)

Reads: `specs/01_product_manager.md`.

Produces:
- **Persona Impact** — how each user persona is affected
- **User Journey Map** — primary flow with touchpoints
- **Cognitive Load Assessment** — new concepts, CLI flag discoverability
- **Error Recovery** — error scenarios with user-facing messages

---

### Phase 3: PM-A — Draft Sprint Plan

**Runs SEQUENTIALLY after Phase 2.** PM-A needs all expert analyses.

Launch a Task agent that synthesizes expert analyses into a complete draft sprint plan in the exact backlog table format.

Draft output format:
```markdown
## Sprint [N]: [Title]

**Goal:** [1-2 sentence goal]
**Status:** 🔲 Planned

### Problem Statement
[What problem does this sprint solve?]

### User Stories
- As a [persona], I want [action] so that [benefit]

### Technical Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|

### Phased Tickets

#### Phase 1: [Phase Name] ([total points] pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| [N].1 | [Title] | [Backend/Frontend/QA/Docs] | [1-8] | 🔲 | — | — |

**Total: [X] points, [Y] tickets**
```

---

### Phase 4: PM-B — Review & Enhance

**Runs SEQUENTIALLY after Phase 3.** PM-B adversarially reviews PM-A's draft.

Launch a Task agent that reviews against this checklist:
1. **Completeness** — all expert recommendations addressed?
2. **Ticket granularity** — no tickets >8 points or <1 point?
3. **Dependencies** — correct and complete?
4. **QA coverage** — every user-facing ticket has a QA ticket?
5. **Documentation gaps** — all `docs/` sections that need updating listed?
6. **Points realism** — total 30-60 for standard sprint?
7. **Overlap** — duplicates existing backlog items?

---

### Phase 5: PM-C — Final Synthesis

**Runs SEQUENTIALLY after Phase 4.** PM-C merges draft + review into the FINAL sprint plan matching the **exact backlog format** (matching the table structure in `specs/backlog.md`).

**Validation checklist (PM-C must verify):**
- [ ] Sprint number is sequential (next after highest in backlog)
- [ ] Every ticket has: ID, Ticket, Owner, Pts, Status (🔲), Deps, Docs
- [ ] No ticket exceeds 8 points
- [ ] Total points between 30–60 (if over 60, split into sub-sprints)
- [ ] QA plan covers every user-facing ticket
- [ ] No overlap with existing backlog tickets

---

### Phase 6: Present & Commit to Backlog

1. **Show sprint summary** to the user with full final sprint plan
2. **Wait for user confirmation** before writing anything:
   - "Commit to backlog" → append sprint to `specs/backlog.md`
   - "Modify first" → ask what to change, apply, re-present
   - "Discard" → do nothing

---

## Important Rules

- ALWAYS run experts in PARALLEL (Phase 2) — they are independent
- ALWAYS run PMs in SEQUENCE — each depends on the previous
- NEVER write to backlog without user confirmation
- ALWAYS match the exact backlog format from existing sprints in `specs/backlog.md`
- Sprint numbers must be sequential
- Use FinOps model selection: haiku (simple), sonnet (standard), opus (architectural)
