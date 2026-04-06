---
name: Persona B Trial Report — Sam (Mid-Level Developer)
type: research
sprint: 40
---

# Persona Trial Report — Sam (Mid-Level Developer)

## Persona Profile
- **Name:** Sam
- **Experience:** Mid-level, 4 years, team lead
- **Background:** Full-stack TypeScript developer, team lead at a 3-person startup. Has used Jira and written PRDs. Comfortable with CLI tooling. Has used GitHub Copilot and Claude for ~6 months. Familiar with the idea of spec-driven development but has not practiced it formally. Tends to think about process in terms of ROI for the whole team, not just personal productivity.
- **Project Idea:** MeetingMind — Next.js + Fastify + PostgreSQL meeting notes app that stores notes, action items, and attendees
- **Starting knowledge of LightSpec:** Heard of spec-driven development, not practiced formally

## Materials Read (checklist)
- [x] QUICKSTART.md
- [x] All 10 methodology docs
- [x] All 6 LSS docs
- [x] CLI source (commands, scanner, pipeline, prompts)
- [x] Key skill files (execute-ticket, sprint-run, sprint-status, plan-sprint, update-backlog)
- [x] Guide steps-en.ts (all 12 steps)

---

## Trial Narrative (≥500 words, chronological)

I came into this with the energy of someone who has spent the last six months watching Copilot and Claude generate mediocre code because I hadn't given them enough context. My team is three people — me, a junior developer, and a designer who can write some frontend. We move fast, but we've had enough "wait, I thought you were building that differently" moments that I've started caring about structure. The pitch for LightSpec was interesting to me: scan what you have, get a spec fast, use it to drive the AI. That's a real pain point for us.

**Getting started: the scan**

I started with `lsp scan .` on the MeetingMind skeleton. We had a standard monorepo layout — `apps/web` with a Next.js stub, `apps/api` with a Fastify setup, a `packages/` directory with shared types, and a `package.json` at root with pnpm workspaces. The scanner picked up TypeScript, Next.js, and Fastify correctly. It detected the monorepo pattern from `apps/` and `packages/` directories, which was accurate. The architecture flags showed API present, Frontend present, Database absent (we hadn't set up Prisma yet — just had an empty `db/` directory).

The complexity score came back at 52/100, which suggested `standard` depth. That felt right for our skeleton. The scan output was clean, readable, and fast — honestly the most polished part of the whole experience. Seeing `Frameworks: next, fastify` on-screen in two seconds gave me immediate confidence that the tool actually understood our stack.

**Running `lsp init`**

The generation step was smooth for what it did. The confirmation prompt is a nice touch — I appreciated being shown the plan before committing. The output landed in `.lsp/spec.md` in about 45 seconds.

When I opened the spec, I was genuinely impressed by the structure. The overview section nailed the product intent from the directory layout alone. The API endpoint table had `POST /api/meetings`, `GET /api/meetings/:id`, action item routes — it had inferred the feature domain correctly from the project name and scaffold structure. This is where brownfield scanning really earns its keep. I didn't write a PRD. I ran one command. The LLM received rich context about my stack and produced something I could actually show my team.

The data model section was decent but shallow. It listed `meetings`, `attendees`, and `action_items` tables with basic fields, but there was no foreign key depth, no index recommendations, and no thoughts on cascade behavior. For our purposes (starting a new product), I needed more. This is the moment I understood the graduation path — LSS is an on-ramp, not a destination.

**Using `/execute-ticket` in Claude Code**

This is where things got interesting for me as a team lead. The skill reads the backlog, checks dependencies, reads relevant docs, implements, runs QA, and updates docs. On paper, that's exactly what I want my AI assistant doing. In practice, I ran into friction.

The skill is designed for a project that already has a `specs/` directory and a `backlog.md` in AutoSpec format. My LSS output was in `.lsp/`. The skill's instructions reference `specs/backlog.md` directly. I had to mentally translate: "oh, the LSS `tasks.md` is the proto-backlog, but `/execute-ticket` isn't reading from there." The two systems don't have a clean handshake at the ticket execution level. I ended up manually reformatting a few tasks from `tasks.md` into a `specs/backlog.md` so the skill could read them. That's maybe 10 minutes of work, but it's a surprising gap given how clean the rest of the pipeline is.

**Trying `/sprint-run`**

The `/sprint-run` skill is impressive in scope. The fact that it orchestrates Phase 1 (briefing and plan), spawns Sonnet agents for parallel ticket batches, requires QA before close, and generates sprint retrospective data for the viewer is genuinely sophisticated. I read through every phase carefully.

Here's the honest assessment: this is a workflow built for a solo developer or a team using Claude Code as the primary environment, with Opus orchestrating Sonnet subagents. As a team lead at a three-person startup, I immediately asked: "What does my junior dev do while the agent is running Sprint 2?" The answer isn't in the docs. The multi-agent pattern is framed entirely around AI agents working in parallel, not human developers working alongside AI agents. There's no guidance on how a human developer picks up a ticket while an agent handles another, or what happens to the backlog state when two humans each run `/execute-ticket` on different tickets at the same time and both try to write to `specs/backlog.md`.

That's the central omission for a team lead perspective. The orchestrator pattern (Opus writes brief, Sonnet implements) makes sense for a solo developer running everything through Claude Code. For a team of three, it feels like I'd be the orchestrator and my team members would each have their own Claude sessions — but the briefing file format and agent spawning instructions assume a single orchestrator running everything.

**Evaluating the graduation path**

`lsp graduate` is where I spent the most time thinking. The command is smart: it extracts sections from the LSS spec by heading name and maps them to AutoSpec role files. What actually worried me is what gets produced for roles 06-10 — they're explicitly stubs with TODO comments saying "run autospec generate." Fine in principle, but when I looked at the stub content, it's genuinely sparse. The `06_devops_lead.md` stub is a handful of bullet points. For our Fastify API that needs Docker, GitHub Actions, and a Railway deployment, the DevOps spec is not something I can auto-generate later and trust. My team would run `lsp graduate`, look at the DevOps stub, and either ignore it (bad) or manually write it (which removes the time savings that justified LightSpec in the first place).

The graduation timing guidance is good though. The doc correctly identifies: team grows beyond 3, complexity score consistently 80+, sprint cadence matures. For MeetingMind at our current size, graduation would probably make sense at the 3-month mark, not day one. That felt accurate.

**Thinking about Jira integration**

One question that kept coming up: does this replace Jira? The honest answer after reading everything is: yes, intentionally, but without acknowledgment of the switching cost. The `backlog.md` is the single source of truth. That's a deliberate design choice. For my team, we'd need to either run two systems (Jira for stakeholder visibility + `backlog.md` for AI execution) or convince the founders that markdown files in Git replace Jira. Neither is trivial. The docs don't address this at all.

**Overall impression**

The scan and generation pipeline is genuinely good. The skill layer (execute-ticket, sprint-run, plan-sprint) is well-designed for the solo-developer-with-AI-agents use case. The graduation path is conceptually sound. The things that fell short for a team lead: no Jira/Linear/GitHub Issues integration story, no human-AI collaboration model, and a gap between the LSS output format and what the skill layer expects.

---

## Friction Log

| # | Step | Command / Action Attempted | What Happened | What I Expected | Severity (1=minor, 5=blocker) |
|---|------|---------------------------|---------------|-----------------|-------------------------------|
| 1 | Installation | `npm install -g lightspec` | Package name is `lightspec` but the binary is `lsp` — this is fine, but the README and QUICKSTART use `lsp` while the package name doesn't obviously match. First-time users Google "lightspec CLI" and may find the wrong package. | Matching package and binary name, or explicit callout in docs | 2 |
| 2 | First scan on monorepo | `lsp scan .` | Database flagged as absent because we hadn't set up Prisma yet — only had an empty `db/` directory. The spec consequently omitted the data model section almost entirely. | Scanner to detect `db/` as a signal, or at minimum a warning: "No database detected — if you have one planned, use --srs to provide an SRS file" | 3 |
| 3 | Reading the generated spec | Opening `.lsp/spec.md` | Data model was present but had no foreign key relationships, no index hints, no cascade behavior. Just a flat table list with column names. | A standard-depth spec on a relational app to include at least basic FK relationships. The scanner detected PostgreSQL intent from Fastify + package.json but the spec treated it as document-style storage. | 3 |
| 4 | Running `/execute-ticket` | `/execute-ticket 1` from Claude Code | The skill reads `specs/backlog.md`. My project had `tasks.md` in `.lsp/`, not a formatted `backlog.md` in `specs/`. The skill either errors or silently uses an empty context. | The skill to read from `.lsp/tasks.md` when `specs/backlog.md` doesn't exist, or an explicit note: "Run lsp graduate first, or manually create specs/backlog.md" | 4 |
| 5 | Trying `/sprint-run` | `/sprint-run 1` | The sprint-run skill includes a Phase 1.5 that updates `viewer/src/data/sprints.ts` and runs `cd viewer && npm run build`. My project has no viewer. The skill would either fail or skip silently, but it's not clear which. | Conditional viewer phase that detects whether a viewer exists before attempting to update it | 3 |
| 6 | Evaluating multi-agent for team use | Reading `05_multi_agent.md` and sprint-run skill | All multi-agent patterns assume AI agents as the parallel workers. No guidance on human + AI parallel work. No handling of concurrent backlog writes by two humans. | A section on "Hybrid teams: 1-3 humans + AI agents" covering file-based coordination, backlog conflict resolution, and when to use agents vs. human developers | 4 |
| 7 | Graduation stubs | `lsp graduate` output for roles 06-10 | Roles 06-10 generated as stubs with "TODO: run autospec generate" comments. The DevOps spec (role 06) in particular is critical for our deployment setup but is essentially empty. | Either auto-populate stubs from README/package.json signals (our CI config, Docker presence, etc.) or clearly warn that these roles require 1-2 hours of manual work before they're useful | 3 |
| 8 | `lsp scan` on scope | `lsp scan . --scope apps/api` | Works correctly, narrows score. But there's no documentation on how scoped specs relate to the project-level spec. Do I run `lsp init` on each app separately? Do I merge them? | Clear guidance: "For monorepos, scan each app separately and generate scoped specs. Use `--output .lsp/api/` and `--output .lsp/web/` to keep them separate." | 3 |
| 9 | Finding the provider setup | First run of `lsp init` | The provider resolution (claude-code → ANTHROPIC_API_KEY → GEMINI_API_KEY) is documented in the guide but not in a visible onboarding step. I had to look at the guide to understand why it silently picked claude-code. | `lsp init` should print which provider it's going to use and why, before asking for generation confirmation. It does print "Using provider: claude-code" but only after you say Y, which is too late if you wanted a different provider. | 2 |

---

## What Worked Well

- **Brownfield scan accuracy:** The scanner correctly detected Next.js + Fastify from a monorepo skeleton with almost no code in it. Seeing `Pattern: monorepo` and `Frameworks: next, fastify` in two seconds validated that the tool actually understands real project layouts, not just simple Express apps. This alone would save us the 15-20 minutes we currently spend writing project context into AI prompts.

- **`lsp status` as a progress dashboard:** The ASCII progress bar and task list output from `lsp status` is genuinely useful for standup. "We're at 71% on sprint 1, 5 tasks remaining" is the exact format I want when someone asks where we are. It's simpler than Jira's sprint board and fits in a terminal window I already have open.

- **The `--depth` override:** The ability to force `lsp init --depth full` when I know the auto-detected depth is too shallow is the right escape hatch. The scoring algorithm is sound for typical projects, but our monorepo with Fastify + Next.js + PostgreSQL is genuinely full-depth territory and deserves the 3-spec decomposition. Having `--depth full` means I don't have to trust the heuristic blindly.

- **Prompt template design (Handlebars + XML tags):** Reading the `.hbs` files in `src/prompts/system/`, the constraint injection via `<constraints>` XML tags and the explicit `<output_format>` section are well-designed. The LLM gets a tightly scoped instruction, not a vague "write a spec." The `brownfieldContext` JSON injection means the model is reasoning about actual detected data, not guessing. This is why the generated spec quality is noticeably above what you'd get from a generic "write a spec for a Fastify app" prompt.

- **`/plan-sprint` expert panel structure:** The 4-expert parallel analysis (Architect, UX/UI, Database, Human Experience) followed by 3 sequential PM passes (Drafter → Reviewer → Finalizer) is exactly the kind of structured planning I wish we did before every sprint. The fact that PM-B adversarially reviews PM-A's draft catches the things a single agent would rationalize away. For sprint planning, this skill is the most immediately valuable thing in the entire framework.

- **The graduation path concept:** The idea that LSS is an on-ramp to AutoSpec — that `lsp graduate` produces seeded role specs rather than empty templates — is exactly the right design for a team trying to grow into a formal process. I don't have to choose between "no spec" and "full AutoSpec ceremony upfront." I can start lightweight and graduate when we're ready. The continuity of `.lsp/` content carrying forward into `specs/` is meaningfully better than starting fresh.

---

## What Failed or Confused Me

- **The LSS-to-skill-layer gap:** The LSS pipeline ends at `.lsp/tasks.md`. The skill layer (execute-ticket, sprint-run, sprint-status) starts at `specs/backlog.md`. There is no bridge between these two formats without running `lsp graduate` first. But graduation is presented as a future milestone, not an immediate prerequisite. The result: if you follow the natural flow of lsp init → start building → use Claude Code skills, you hit a wall at execute-ticket. This is the most significant gap in the user journey.

- **The viewer dependency in sprint-run:** `sprint-run` Phase 1.5 and Phase 5b both reference `viewer/src/data/sprints.ts` and `viewer/public/docs/`. The AutoSpec viewer is a specific React app that lives in `autospec/viewer/`. A new project starting with LSS or AutoSpec does not have this viewer. The sprint-run skill will either fail or require the user to skip those phases manually. There's no conditional logic documented. A mid-level developer reading this skill for the first time will be confused about whether the viewer is required.

- **No model-switching guidance for non-Claude providers:** The FinOps model selection framework throughout the methodology docs (haiku/sonnet/opus tiering) is entirely Claude-centric. The docs acknowledge OpenAI models (GPT-3.5/GPT-4) in passing but give no concrete guidance on how to assign model tiers when you're using the OpenAI provider. If I'm running on OpenAI, "use haiku for simple tasks" means nothing — I need to know the OpenAI equivalents and how the `--provider openai` + `--model` flags interact with the recommended model assignments in `backlog.md`.

- **Concurrent team usage is entirely unaddressed:** The methodology treats `specs/backlog.md` as a shared mutable file that agents update during execution. For a 3-person team where two people might be executing tickets simultaneously — one in their Claude Code session, one in their own — the conflict model is undefined. The docs mention git conflicts briefly but the resolution guidance ("human review, merge manually") is unsatisfying for a scenario that happens multiple times per day in active development.

- **The `lsp scan` output doesn't tell you what it missed:** The scan prints what it detected. It doesn't print what it couldn't detect. For a brownfield project where routes are dynamically registered (common in Fastify with decorators), the route list will be incomplete — but you won't know that from looking at the scan output. As a team lead I want a "low-confidence signals" section: "These routes may be incomplete because we detected dynamic registration in 3 files." Without that, the spec quality is opaque — I have to know enough about static analysis limitations to distrust the output in the right places.

---

## Missing Documentation (specific gaps)

**1. Monorepo-specific workflow guide.** The scanner detects monorepos and mentions `--scope`, but there's no dedicated documentation on the recommended LSS workflow for a multi-package repository. Do I run `lsp init` once at root? Once per app? How do scoped specs relate? What goes in `.lsp/` vs `.lsp/web/` vs `.lsp/api/`? This is a common project structure and it deserves its own doc.

**2. LSS → skill-layer migration path.** There's no documentation explaining how to move from LSS (`tasks.md`) to the Claude Code skills that expect `specs/backlog.md`. The graduation docs describe `lsp graduate`, but they don't say "you must graduate before using execute-ticket" or provide a lighter-weight alternative (e.g., a `lsp init-backlog` that creates a minimal `specs/backlog.md` from `tasks.md` without full graduation).

**3. Team workflow guide.** "How does a 3-person team use this?" is a question that goes entirely unanswered. The multi-agent docs describe AI agents. The solo developer use case is implicit throughout. But a 2-4 person team is probably the most common early adopter profile, and there's no guidance on: how to divide tickets between humans vs. agents, how to avoid backlog.md conflicts, how to run standups using the tool's output, or whether GitHub Issues/Linear can be used in parallel.

**4. Provider equivalency table.** The FinOps section names Haiku/Sonnet/Opus and GPT-3.5/GPT-4 but never gives a mapping. A clear table of "LSS tier → Claude model → OpenAI model → Gemini model" would make the framework provider-agnostic in practice, not just in theory.

**5. What to do when the spec is wrong.** The docs cover "spec is complete, now execute it." They don't cover "the generated spec has a section that's completely off-base." There's no guidance on spec editing workflow — how much to edit by hand before `lsp init` becomes less valuable than just writing your own spec, and how to mark sections of the spec as "manually curated" so a re-run doesn't overwrite them.

**6. Error recovery in `lsp init`.** The CLI exits with `process.exit(1)` on provider failure with a message. But there's no documentation on what to do when the generation completes but produces a low-quality spec. The tool has no built-in regeneration or partial regeneration capability — if the spec is bad, you run `lsp init` again from scratch (presumably with a `--force` flag, which is mentioned once in the guide but not in the CLI help text).

---

## CLI UX Issues

**Missing `--force` in help text.** The guide (step 5, `lsp init . --depth=full --force`) mentions a `--force` flag, but reading the `init.ts` source code, I don't see `--force` handled in the `opts` parsing. The `--yes` flag skips confirmation. There's no flag to overwrite an existing `.lsp/spec.md`. If you run `lsp init` twice, it will regenerate by default (no existence check on the output file), but it's not clear this is the intended behavior.

**Confirmation prompt timing.** The provider is resolved after you confirm generation. If provider resolution fails (no API key), you've already said yes to a generation that can't proceed. The provider check should happen before the confirmation prompt, or the plan display should include the resolved provider.

**No `lsp init --dry-run` documentation.** The `--dry-run` / `--dryRun` flag exists in the source code but isn't mentioned in the QUICKSTART or methodology docs. It's the most useful flag for evaluating what the tool would do before committing. It should be in the quick start guide.

**`lsp status` requires `.lsp/tasks.md` to exist.** If you run `lsp status` before `lsp init`, the error message is a file-not-found crash rather than a helpful "run lsp init first" message. The error handling should be user-friendly for this predictable first-run scenario.

**`lsp graduate` doesn't validate the spec quality before mapping.** If `spec.md` is mostly placeholder text (e.g., a failed generation that wrote 50 lines of error messages), `graduate` will happily map that garbage into 10 role spec files. There should be a minimum content check before proceeding.

**No `--help` detail on flag combinations.** Running `lsp init --help` shows the available flags, but gives no examples and no guidance on which flags are mutually exclusive or dependent. `--scope` and `--srs` can be combined — does scope apply to the scan or the spec content? The source code answers this (scope applies to scan only), but the CLI user shouldn't need to read source code.

---

## Spec Quality Assessment

| Spec File | Rating (1-10) | Notes |
|-----------|--------------|-------|
| CLAUDE.md (generated by graduate) | 5/10 | The template is minimal — project name as placeholder, 3 generic rules, no actual project URLs or build commands. It's a starting point, but a new team member reading it wouldn't learn anything about the project. Needs significant manual filling to be useful as Claude Code memory. |
| backlog.md format | 7/10 | The graduated `backlog.md` correctly converts `tasks.md` items and includes the sprint structure. The missing piece is the model assignment column and points estimates — they're in the full AutoSpec format but absent from the LSS-graduated version. You have to add those manually before skills like `sprint-status` can show FinOps metrics. |
| Role spec quality (01-05) | 7/10 | The mapped content from LSS to roles 01-05 is coherent and genuinely useful as a starting point. The PM spec (01) captures the product intent well. The backend spec (02) has architecture and API sections. The data model section is shallow for a relational database. Overall better than starting from scratch but requires review before treating as authoritative. |
| Multi-agent workflow clarity | 6/10 | The orchestrator + agent pattern is well-documented as a concept, but the mechanics of spawning agents (using the Agent tool in Claude Code) are described as a JavaScript object call that only makes sense if you know how Claude's tool-use API works. A developer who hasn't read the Claude documentation won't know how to actually execute `Agent({subagent_type: "general-purpose", ...})`. |
| Graduation path documentation | 8/10 | The graduation path docs are the strongest part of the LSS documentation set. The timing guidance is concrete, the section-to-role mapping is clearly explained, and the "what stays, what gets regenerated" section prevents common mistakes. Loses two points for not having a worked example showing what a real graduated spec looks like before and after. |

---

## Multi-Agent Workflow Assessment

As a team lead, the Opus orchestrator + Sonnet agent pattern is the piece I evaluated most carefully, because it touches the question of how my team actually works.

**What the pattern gets right:** The briefing file approach (writing `agents/sprint-X-brief.md` before spawning) is genuinely smart. The observation that context drift and hallucination are worse in long conversations, and that a brief file re-grounds the agent at the start of its session, matches my experience with Claude in long coding sessions. The parallelism capability — spawning multiple Sonnet agents for independent sprint batches in a single message — is a real velocity multiplier for the scenario it's designed for.

**What's over-engineered for a 3-person startup:** The pattern assumes you have one person (the orchestrator) whose job is to write briefs and spawn agents, and a fleet of agents doing the implementation. For a 3-person team, I'm the orchestrator AND a developer. My team members are also developers. Running Opus as an orchestrator to write briefs for Sonnet agents that then implement tickets is valuable when I'm trying to ship a full sprint in an afternoon while I'm unavailable. It's overkill for the normal pattern of "each developer picks their tickets and uses Claude to help implement them."

**What's missing for a hybrid team:** There's no pattern for "human developer A takes tickets 1, 3, 5 while AI agent handles 2, 4, 6." There's no guidance on how a human developer marks their own tickets without running through the full skill layer. There's no shared state model — if my junior dev is implementing ticket 3 manually (no Claude) and I'm running an agent on ticket 4, the backlog.md writes won't conflict, but there's nothing preventing the agent on ticket 4 from reading stale context about ticket 3 and making incompatible decisions.

**Recommendation:** Add a "Small team (2-4 humans + AI)" section to the multi-agent docs that describes a simpler coordination pattern: humans own their tickets in GitHub Issues or linear (the human-facing tracker), backlog.md is the AI execution state (updated only when agents are running), and the two are periodically synced by the team lead.

---

## Team Adoption Assessment

**Would my 3-person team actually use this?**

Honestly: the LSS layer (scan + init + status) — yes, probably. It solves a real problem we have. Getting a grounded spec in 45 seconds is better than the 45 minutes it takes us to write a PRD in Notion and then copy-paste it into Claude. The `lsp scan` output also serves as a nice automated onboarding summary when someone joins the project.

The full AutoSpec layer (post-graduation, sprint-run, plan-sprint with expert panels) — maybe, but with friction. The adoption blockers in rough order of severity:

1. **Jira/Linear migration.** We use GitHub Issues as our team task tracker. Our stakeholders look at it. Switching to `backlog.md` as the single source of truth would require either convincing two people to change tools or maintaining two systems. The framework provides no integration path.

2. **Learning curve for the skill layer.** The 10 SDD skills are well-documented but assume Claude Code as the execution environment. My junior developer uses Cursor. The Cursor equivalents exist (the skills work in any context), but there's no Cursor-specific onboarding.

3. **Viewer requirement is confusing.** The sprint-run skill references the viewer in two phases. We don't have a viewer app. Understanding which phases to skip and why is friction that would cause my junior dev to not trust the tool.

4. **The backlog.md format needs ongoing maintenance.** The model assignment column, points estimates, and dependency tracking are genuinely useful, but they require discipline to maintain. On a 3-person team that's moving fast, the backlog.md will drift out of sync with reality within two weeks unless someone owns it. There's no automated way to detect or repair drift.

**Bottom line:** If I were onboarding my team today, I'd introduce `lsp scan` and `lsp init` as personal tools for each developer to use when starting a feature. I would not mandate the full AutoSpec workflow. I'd revisit graduation at 3 months or when the team grows to 5.

---

## Top 3 Recommendations

1. **Bridge the LSS-to-skills gap with a lightweight `lsp init-backlog` command:** The most disruptive break in the user journey is between `lsp init` (produces `tasks.md`) and `/execute-ticket` (reads `specs/backlog.md`). Rather than requiring full graduation, add a `lsp init-backlog` (or a `--backlog` flag on `lsp init`) that creates a minimal `specs/backlog.md` from `tasks.md` with proper Sprint 1 format, model assignments defaulting to `sonnet`, and ownership defaulting to `Fullstack`. This would let developers use the skill layer immediately after `lsp init` without committing to full AutoSpec graduation.

2. **Add a "2-5 person team" workflow guide as a first-class documentation section:** The current docs serve solo developers (clear) and large teams running Opus orchestrators (described). The gap in the middle — 2-5 people mixing human development with AI agents — is where most early adopters will be. This guide should cover: how to divide tickets between humans and agents, how to prevent backlog.md conflicts, whether to run parallel Claude Code sessions or one shared session, and a simple integration with GitHub Issues as the human-facing tracker.

3. **Emit a `--confidence` report alongside scan results:** The scan output currently tells you what it found. Add a section that tells you what it probably missed. Specifically: if routes are flagged as potentially incomplete (dynamic registration detected), if the database schema is inferred vs. detected from actual migration files, and if test coverage estimates are based on file-count sampling vs. actual coverage reports. This would let developers calibrate how much to trust the generated spec, and would prevent the false confidence that comes from a clean scan output on a project where half the complexity is invisible to static analysis.

---

## Summary Scores
- **Raw Satisfaction Score:** 7/10
- **Would Recommend:** Yes — with caveats. "Use `lsp scan` and `lsp init` today. Graduate and use the full skill layer when your team is ready for the discipline overhead."
- **Biggest Blocker:** The gap between LSS output (`tasks.md`) and the skill layer (`specs/backlog.md`) — the tool's two halves don't connect without either running `lsp graduate` (a future-milestone action) or manually creating the bridge file.
- **Best Surprise:** The `lsp scan` output quality on a monorepo skeleton with very little code. I expected it to struggle. It correctly identified the architecture pattern, both frameworks, and the presence of API + frontend concerns from directory structure alone. That's meaningfully better than I expected, and it's the core value proposition working exactly as advertised.
