---
name: Persona A Trial Report — Alex (Junior Developer)
type: research
sprint: 40
---

# Persona Trial Report — Alex (Junior Developer)

## Persona Profile
- **Name:** Alex
- **Experience:** Junior, 1 year of professional experience
- **Background:** Self-taught JavaScript and React developer; attended a 6-month bootcamp. Knows npm, Git basics, VS Code with GitHub Copilot. Has heard of TDD but does not practice it. Has never worked with a spec-driven workflow. Comfortable with `package.json`, basic Express, and React components. Has not used CLI tools beyond `npm`, `git`, and `npx`.
- **Project Idea:** BudgetBuddy — Node.js CLI personal finance tracker (CSV import + categorization)
- **Starting knowledge of LightSpec:** None

## Materials Read (checklist)
- [x] QUICKSTART.md
- [x] lss/01_philosophy.md
- [x] lss/03_scanner.md
- [x] methodology/01_philosophy.md
- [x] methodology/02_spec_structure.md
- [x] guide steps-en.ts
- [x] CLI source (commands + scanner)

## Trial Narrative (≥400 words, chronological)

I heard about LightSpec on a Discord server where someone said it could generate a "spec" for your project in under a minute. I thought that sounded cool — I'm always jumping into code without a plan and then getting stuck halfway through. BudgetBuddy has been sitting half-done in my repos folder for two months. Maybe this would help me figure out what I'm actually building.

**Finding the docs**

I started at QUICKSTART.md, which I found... fine, actually. The top three steps (add requirements, tell your AI, watch it generate) felt clear. But then I noticed the step 2 says "tell your AI — run @QUICKSTART.md" and I got confused immediately. What AI? I use GitHub Copilot, not Claude. Do I need to switch? There's an environments table listing vscode-copilot, which gave me some hope, but then most of the example commands below use Claude Code syntax — `lsp init`, `/sprint-run`, etc. I wasn't sure if `lsp` was a separate thing from the AutoSpec QUICKSTART pipeline or the same thing. Nobody told me to install anything yet.

I scrolled down and the QUICKSTART.md gets very long. I'm talking hundreds of lines of content that feels like it's for the AI to read, not for me. It starts with `{{INPUT_FOLDER}}` template variables and role specs and generation plans. I got lost around line 200. I didn't know if I was supposed to read all of this or just copy-paste it somewhere.

**Trying to understand "LightSpec" vs "AutoSpec"**

I then read `lss/01_philosophy.md` and that helped me understand there are two tools: LightSpec (the lightweight one, `lsp` CLI) and AutoSpec (the heavy one). LightSpec is the right fit for me — I'm a solo dev and BudgetBuddy is simple. The philosophy doc was actually the most readable thing I encountered. The comparison table (AutoSpec vs LightSpec) was exactly what I needed to see first. I wish this had been the landing page.

**Reading the scanner doc**

`lss/03_scanner.md` was interesting but honestly kind of technical. I liked knowing the scanner runs without any LLM calls and is fast. But the section about "Supported languages: TypeScript, JavaScript, Python, Go, Rust, Ruby, Java, Kotlin, C/C++, C#, PHP (via file extensions from `gatherMetrics`)" reads like internal documentation, not user documentation. I don't need to know what `gatherMetrics` is. I just want to know: will it understand my Node.js project? (Yes, apparently.)

One thing that confused me: the scanner doc says to use `--scope <subdir>` for monorepos, but I didn't see that flag documented anywhere else I looked. Where do I find the full list of flags?

**AutoSpec methodology docs**

`methodology/01_philosophy.md` and `methodology/02_spec_structure.md` felt like they were written for a team lead or a senior developer. The "English Kef Case Study" section made me feel like the author already had a complex production app. BudgetBuddy is a 3-file Node.js CLI. Reading about 9-role models, sprint orchestration with parallel AI agents, and "Agent A (Backend Window)" / "Agent B (Frontend Window)" made me feel like I was in the wrong room. None of this mapped onto my situation as a solo dev with a CSV parser.

The spec structure doc was thorough but overwhelming. It expects me to write or generate specs with full SQL `CREATE TABLE` statements, complete API endpoint tables with request/response JSON, and performance targets like "LCP < 2.5s". My CLI tool doesn't have an LCP. I am not building a web app.

**The interactive guide (steps-en.ts)**

Reading the guide steps gave me the clearest picture of what actually happens step-by-step. The example project (Task Flow API) is close enough to BudgetBuddy (Node.js CLI with some data processing) that I could follow along. The terminal output examples in the guide were really helpful — seeing the actual `lsp scan` output format set my expectations correctly.

Step 6 (lsp status) taught me the key mechanic: you mark tasks done by editing `.lsp/tasks.md` manually, changing `[ ]` to `[x]`. That's... fine? But it means I'm editing a generated file by hand. What if the format is wrong? What if I add a space in the wrong place and the parser breaks?

**Simulating lsp scan on BudgetBuddy**

Okay, so I imagined running `lsp scan .` in my BudgetBuddy folder. I have:
- `package.json` (with `csv-parse` as a dep, no framework)
- `src/index.js` (entry point, ~60 lines)
- `src/importer.js` (CSV reading, ~80 lines)
- `src/categorizer.js` (category matching, ~50 lines)
- No test files
- No `src/routes/` directory

Based on what I read about the scanner's scoring: 3 source files = maybe 8 points for file count (under 10 files → 2 points actually), tiny line count = 1 point, no frontend/database/test files, architecture would come back as "unknown" because there's no `src/modules/`, no `apps/`, just flat `src/`. Stack: JavaScript, no frameworks detected (no Express, no NestJS — csv-parse is not on the framework list).

I'd expect the scanner to give a score of maybe 5-10/100 and suggest "micro" depth. That seems correct for my project. Good.

**Simulating lsp init**

Running `lsp init .` in my head: it scans, gets a micro spec recommendation, asks me "Proceed? [Y/n]", I type Y, it tries to resolve an LLM provider.

Here's where I got stuck. The guide says: "LightSpec resolves the LLM provider automatically. If `claude` is in your PATH and authenticated, it uses claude-code." I don't have Claude Code installed. I use Copilot. The next fallback is `ANTHROPIC_API_KEY` or `GEMINI_API_KEY`. I don't have those set as environment variables. I don't know where to get them or how much they cost.

The error message I'd likely see is something like "No LLM provider available" with some instructions. But nowhere in any of the docs I read is there a plain step saying "if you use VS Code + Copilot, here is how to get an API key for the LLM that lsp init needs." The QUICKSTART lists vscode-copilot as a supported environment, but `lsp init` doesn't use Copilot — it uses Claude or Gemini. These seem like different things to me. I'd be confused about which environment I'm in.

**Simulating lsp status**

Assuming the init somehow ran: I'd get a `.lsp/spec.md` and `.lsp/tasks.md`. Running `lsp status` gives me a progress bar and a task list. That looks genuinely useful and clear from the source code. The format is clean. I like that it shows priority and time estimates per task.

The problem is: when I need to mark a task done, I have to open `.lsp/tasks.md` in VS Code and manually edit a markdown table row. The hint in the guide is `| 13 | Write auth tests | Medium | 1h | [x] done |`. But `lsp status` parses the Done column looking for `[x]`, `true`, or `done`. If I write `[x] done` that covers both patterns at once, which is redundant. If I write just `[x]`, does it work? The status.ts source shows `doneCell.toLowerCase().includes('[x]')` — yes, `[x]` alone would work. But the guide says to write `[x] done`. That's a minor contradiction that would confuse me.

**Simulating lsp graduate**

I ran through the `graduate.ts` source. After finishing all tasks, I'd run `lsp graduate`. It reads `.lsp/spec.md`, extracts sections by heading name, and creates 10 spec files in `specs/`. Roles 06-10 are stubs with "TODO: This spec was auto-generated as a stub" messages.

For BudgetBuddy (a CLI with no frontend, no database, no DevOps setup) the `03_frontend_lead.md` would contain a fallback placeholder `"_See .lsp/spec.md for frontend details._"`. Same for `04_db_architect.md`. Half the generated AutoSpec files would basically be empty stubs pointing back to the original spec.

That makes graduate feel premature for my use case. LightSpec is right-sized for BudgetBuddy; I don't need to graduate at all. The CLI even says "when ready" which is the correct framing — but then graduating produces 10 files where 5 are nearly blank. That feels incomplete, not like a real upgrade.

**Overall impression**

The core loop — scan, init, read spec, build things, mark done, status — is sound and sensible. The spec output itself, from what I saw in the guide, is genuinely useful: actual endpoint tables, phased implementation plan, concrete task estimates. That's the value.

The problem is the path to that loop. The docs layer multiple frameworks (AutoSpec, LightSpec, methodology docs) on top of each other with inconsistent terminology, assume tools are installed that aren't, and bury the simple "install lsp CLI and run it" instructions. A junior dev will spend 30+ minutes confused before getting the first real value.

---

## Friction Log

| # | Step | Command / Action Attempted | What Happened | What I Expected | Severity (1=minor, 5=blocker) |
|---|------|---------------------------|---------------|-----------------|-------------------------------|
| 1 | Finding install instructions | Opened QUICKSTART.md looking for `npm install` | Couldn't find any install command for the `lsp` CLI. The QUICKSTART talks about "tell your AI" and paste steps, not a CLI install. Searched for "npm install" in the doc — not present. | A clear line like `npm install -g lightspec` at the very top, before any other content. | 5 |
| 2 | Understanding LightSpec vs AutoSpec | Read QUICKSTART.md top-to-bottom | QUICKSTART.md is for AutoSpec (10-role generation via an AI prompt). But `lsp init` is LightSpec. The two tools share terminology (specs, backlog) but have completely different workflows. Nothing in QUICKSTART.md explains LightSpec or `lsp` commands. | A single entry point that explains: "We have two tools. Start here based on your situation: [LightSpec for solo/simple] [AutoSpec for teams/complex]." | 4 |
| 3 | Running `lsp init` — LLM provider not found | Simulated: `lsp init .` in a project with no Claude installed, no API keys set | The CLI would fail with "No LLM provider available." No Claude Code installed, no `ANTHROPIC_API_KEY`, no `GEMINI_API_KEY` in my environment. I use GitHub Copilot, which is not a supported provider for `lsp init`. | Documentation that explicitly tells VS Code + Copilot users "you still need a separate API key for lsp init — here's how to get one (it's free for Gemini)." | 5 |
| 4 | Marking a task done in tasks.md | Tried to understand how to check off a task by reading guide + status.ts source | The guide example says `[x] done` but the parser checks for `[x]` separately from `done`. Either works independently. The redundant format in the example is confusing and implies a specific required syntax that doesn't match the actual parser. | A clear canonical example: `| 3 | Set up CSV parser | High | 1h | [x] |` — minimal, unambiguous. | 2 |
| 5 | Understanding what "lsp graduate" produces for simple projects | Read graduate.ts, realized roles 06-10 are always stubs regardless of project type | For a CLI tool like BudgetBuddy with no frontend and no database, the graduate command creates `03_frontend_lead.md` containing only `"_See .lsp/spec.md for frontend details._"`. Half the 10 spec files are useless. | Either skip stub files for roles that don't apply to the project, or ask the user which roles are relevant before generating. | 3 |
| 6 | Finding the complete list of CLI flags | Looked in QUICKSTART.md, lss docs, guide steps — tried to find `--scope`, `--depth`, `--force`, `--srs`, `--provider` | No single place documents all available flags. `--scope` is mentioned in `03_scanner.md` without context. `--depth` and `--force` appear in the guide steps. `--srs` and `--provider` only in `init.ts` source code. | A CLI reference page or even just `lsp --help` output shown in the docs that lists every command, every flag, and a one-line description of each. | 4 |
| 7 | Mapping AutoSpec methodology docs to LightSpec workflow | Read `methodology/01_philosophy.md` and `02_spec_structure.md` | These docs describe a 9-role (later 10-role) model, multi-agent orchestration, sprint ceremonies, and parallel Claude windows. None of this is LightSpec. I'm a solo dev. Reading about "Agent A (Backend Window)" and "Agent B (Frontend Window)" felt like reading about a workflow I'd need a team and a budget for. | Methodology docs labeled clearly as "AutoSpec methodology (for teams / large projects)" with a prominent note that LightSpec users can skip these. | 3 |

---

## What Worked Well

- **The philosophy doc (`lss/01_philosophy.md`) was genuinely readable:** It was the clearest explanation I read of what the tool is and why it exists. The "Specification Paradox" framing resonated. The AutoSpec vs LightSpec comparison table gave me everything I needed to pick the right tool in about 30 seconds.

- **The scan step is completely free (no LLM required):** I loved finding out that `lsp scan` runs entirely on the filesystem with no API calls. For a junior dev who is nervous about costs and signing up for things, knowing I can see the complexity score before committing to any LLM usage is reassuring.

- **The interactive guide terminal examples were accurate and readable:** The simulated `lsp scan` and `lsp init` output in the guide matched the actual CLI source code behavior. I could reason about what my output would look like for BudgetBuddy. That predictability is valuable.

- **`lsp status` output is clean and immediately useful:** The progress bar, task list with priorities and time estimates, and the hint to use `lsp graduate` when done — that's a tight, well-designed UX. Nothing extraneous. The colored priority labels (red for High, yellow for Medium, gray for Low) give quick visual hierarchy.

- **The complexity scoring is deterministic and explainable:** The scanner docs explain exactly how points accumulate (file count up to 25pts, line count up to 20pts, etc.). I can predict roughly what my score will be before running the tool. That predictability is rare — most tools are black boxes.

- **`lsp init --dry-run` flag exists:** Seeing in the source code that you can do a dry run before actually spending LLM tokens is a thoughtful safety net. This should be advertised more prominently in the docs for budget-conscious juniors.

- **YAML frontmatter on generated spec:** The generated `spec.md` includes `depth`, `date`, `complexity score`, and `provider` in frontmatter. This means I can look at the file later and understand exactly how it was made, which helps if I need to regenerate or audit the spec.

---

## What Failed or Confused Me

- **No install instructions anywhere in the main docs:** Not one of the documents I was assigned to read tells me `npm install -g lightspec`. The guide step 1 terminal example shows `npm install -g lightspec` but that's buried in the guide web app, not in the printed documentation. A junior dev reading markdown files would never find it.

- **AutoSpec and LightSpec documentation are interleaved without clear labeling:** The `methodology/` docs describe AutoSpec's 9-role model. The `lss/` docs describe LightSpec. Both live in the same `docs/` folder of the same project. There is no prominent disclaimer on the methodology docs saying "these describe AutoSpec, not LightSpec." For a new user, these feel like instructions for the same product.

- **The VS Code + Copilot environment path is a dead end for `lsp init`:** QUICKSTART.md lists `vscode-copilot` as a supported environment and describes how to use Copilot Chat for AutoSpec skills. But `lsp init` doesn't support Copilot at all — it requires Claude Code, Anthropic API, or Gemini API. This is not explained anywhere visible. A user who set up their `.autospec/config.yml` with `environment: vscode-copilot` would still hit the "No LLM provider available" error running `lsp init`.

- **The 10-role model in AutoSpec includes roles that make no sense for most simple projects:** `07_marketing_lead.md`, `08_finance_lead.md`, `09_business_lead.md` — for BudgetBuddy, a personal CLI tool, these are meaningless. Even after graduation, they appear as stubs. The QUICKSTART explains what these files *should* contain (pricing, SWOT analysis, go-to-market strategy) which makes a solo dev feel like they're doing it wrong by not filling them in.

- **`lsp status` requires manually editing a generated file to track progress:** The intended workflow is to open `.lsp/tasks.md` in a text editor, find the right row in the markdown table, and change the status cell. This is fragile and tedious. If the table formatting is off by one pipe character, the regex parser in `status.ts` silently drops the task. There's no CLI command like `lsp done 3` to mark task #3 complete without touching the file.

- **The `lsp graduate` command produces half-empty output for simple projects:** For a CLI tool with no frontend, no database, and no DevOps infrastructure, five of the ten generated AutoSpec spec files are stubs containing only auto-generated placeholder text. This makes "graduating" feel like a downgrade — I went from one focused spec file to ten files where half say "TODO."

- **Error messages for missing LLM provider are not documented:** The `init.ts` source exits with "No LLM provider available" followed by the actual provider error message. There is no documentation on what that error looks like in practice or how to resolve it without reading source code.

---

## Missing Documentation (specific gaps)

1. **Getting started in 3 actual steps** — I looked for a "quick install" section specifically for LightSpec (not AutoSpec). It does not exist as a standalone document. The closest thing is the guide web app's step 1 terminal block, which isn't a Markdown file.

2. **LLM provider setup guide** — I looked for a document explaining "how to get an API key if you don't have Claude Code." There is none. The `init.ts` source says it tries `resolveProvider(providerOverride)` but what providers are supported, what environment variables they need, and which ones are free — none of this is documented outside the source code.

3. **CLI flag reference** — I looked for a page listing every `lsp` command and every accepted flag. The closest I found was scattered mentions in the guide steps (`--depth=full`, `--force`) and the `init.ts` source (`--srs`, `--provider`, `--model`, `--yes`, `--dry-run`, `--scope`, `--output`). There is no canonical list.

4. **"When to graduate" decision guide** — I looked for guidance on when to run `lsp graduate`. The CLI says "when ready" and the status output says it when 100% of tasks are done. But for a project that will always be simple (like a personal CLI tool), the answer might be "never graduate — stay in LightSpec." There's no doc that says this explicitly.

5. **How to regenerate a spec** — I found `--force` mentioned once in the guide step 5 (`lsp init . --depth=full --force`) but no explanation of when you'd want to do this (e.g., after adding more code, after changing the project significantly). No doc explains the lifecycle: scan → init → build → update spec → repeat.

---

## CLI UX Issues

- **`lsp status` hardcodes the path to `.lsp/tasks.md` relative to `process.cwd()`** — if I'm in a subdirectory when I run `lsp status`, it fails silently with "No LightSpec output found" and tells me to run `lsp init`. The error message doesn't mention that the working directory matters.

- **The "Marking tasks done" mechanic has no in-CLI affordance** — `lsp status` output ends with: `Mark tasks done by editing .lsp/tasks.md (change [ ] to [x])`. This is three levels of indirection for a junior: open file, find the row, edit the right cell, save, re-run command. A `lsp done <id>` command would be much more natural.

- **`lsp graduate` overwrites `CLAUDE.md` without warning** — The source code does `writeFile(path.join(process.cwd(), 'CLAUDE.md'), claudeMd, 'utf-8')`. If I already have a `CLAUDE.md` from my own project setup, it silently overwrites it with a generic template. There is no `--dry-run` flag on `graduate` and no confirmation prompt for the CLAUDE.md write.

- **The scan summary sentence is machine-generated and sometimes awkward** — The output reads: "This is a monolith project written in JAVASCRIPT/TYPESCRIPT" with capital-letter language names. For a project with only a `package.json` and three flat JS files with no `src/modules/`, the architecture would come back as "unknown" — but "unknown" architecture is reported the same way as any other, which could be confusing.

- **Provider error message is too terse for juniors** — The message "No LLM provider available" plus whatever the underlying library throws is not actionable for someone who doesn't know what `ANTHROPIC_API_KEY` is or where to get one. It needs a fallback hint: "Try: export ANTHROPIC_API_KEY=your-key (get one free at anthropic.com)".

---

## Spec Quality Assessment

| Spec File | Rating (1-10) | Notes |
|-----------|--------------|-------|
| CLAUDE.md (generated by graduate) | 5 | Generic template with placeholder `[Project Name]`. The three rules (Backlog-First, Living Documentation, QA Before Done) are useful but the file is essentially the same for every project. No project-specific context is injected. |
| backlog.md format | 7 | The emoji-based status system is genuinely good UX. The sprint structure is clear. The format would intimidate a junior dev who has never seen it before — there's no explanation of what the emojis mean in the generated file itself. |
| Role spec quality (01-05 from graduate) | 6 | Content quality depends entirely on what the LightSpec spec.md contained. The section extraction logic (by heading name) is a reasonable heuristic but brittle — if the spec doesn't have a heading called "Technical Design" or "Architecture" it falls back to a generic placeholder. For simple projects, 3 of 5 role specs may be mostly fallback text. |
| Role spec quality (06-10, stubs) | 2 | These are pure stubs with TODO comments and single-item checklists. For a solo dev project, generating these files at all is misleading — it implies there's a DevOps lead, a security lead, a data engineer, and a tech writer who need their own spec files. |
| Generated output clarity (spec.md itself) | 8 | Based on the guide example, the actual `spec.md` content is excellent — concrete endpoint tables, real data model fields, phased implementation plan with named files. This is the best part of the product. The file is readable, actionable, and specific to the detected stack. |

---

## Top 3 Recommendations

1. **Add a standalone "LightSpec Quick Start" as the first page users see:** Create a `LIGHTSPEC_QUICKSTART.md` (or make it the readme of the `lsp` CLI) that says exactly three things: (1) `npm install -g lightspec`, (2) `lsp scan .` to see your complexity score, (3) `lsp init .` to generate a spec (requires an LLM API key — here's how to get one for free with Gemini). Do not mix this with the AutoSpec QUICKSTART. Junior developers need a single, correct path. The current documentation makes them assemble that path from five separate sources.

2. **Add `lsp done <task-id>` as a CLI command:** The biggest daily friction point is the "edit the markdown table by hand" workflow. A single command that marks task N as done — writing the correct table syntax automatically — would make the daily loop feel like a real tool and not a workaround. It would also eliminate the silent parsing failure that happens when a user accidentally malforms the table row. This is a two-hour implementation that would dramatically improve the perceived polish of the tool.

3. **Guard `lsp graduate` for projects that don't need full AutoSpec expansion:** Before creating 10 spec files, `lsp graduate` should check the scan result (already available in `.lsp/` metadata or rerunnable) and skip roles that don't apply. A project with `hasDatabase: false` should not produce a `04_db_architect.md`. A project with `hasFrontend: false` should not produce a `03_frontend_lead.md`. At minimum, add a `--roles` flag so users can say `lsp graduate --roles=pm,backend,qa`. Generating stubs for inapplicable roles makes the output feel low-quality and confuses new users about what they're supposed to fill in.

---

## Summary Scores
- **Raw Satisfaction Score:** 5/10
- **Would Recommend:** Maybe — the generated spec content (spec.md) is genuinely useful and the scanning approach is clever, but a junior developer will hit a blocker before ever seeing the good part (the provider resolution failure), and the documentation doesn't help them get unstuck.
- **Biggest Blocker:** No documentation on how to get an LLM API key if you don't already have Claude Code or Anthropic credentials — the tool exits with a cryptic error at the moment that should be the payoff.
- **Best Surprise:** The brownfield scanner is completely free to run and produces a surprisingly useful summary of your project in under a second — no API key, no setup, just filesystem analysis. `lsp scan .` is genuinely delightful and I wish it was the first thing the docs showed me.
