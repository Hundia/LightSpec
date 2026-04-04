---
title: LightSpec Philosophy
sprint: 37
created: 2026-03-27
---

# LightSpec Philosophy

## "Just Enough Spec, Just Fast Enough"

LightSpec exists because of a fundamental tension in software development: the specification paradox. Too much specification kills velocity — teams spend more time documenting intent than executing it. Too little specification kills quality — developers build the wrong thing, or build the right thing wrong.

---

## The Specification Paradox

Every spec framework faces the same dilemma: a tool designed to help all projects tends to design for the hardest projects. AutoSpec, for example, generates a comprehensive 10-role specification suite with product vision, technical architecture, database design, QA strategy, and more. For a greenfield SaaS product, this is exactly right. For a solo developer adding a new endpoint to an existing API, it is catastrophic overkill.

The paradox manifests in three failure modes:

1. **Paralysis by documentation** — The spec process is so heavy that developers skip it entirely, or treat it as a post-hoc bureaucratic exercise with no real value.
2. **Spec drift** — A 30-page spec generated in week 1 is 60% inaccurate by week 3. Developers stop reading it. It becomes shelfware.
3. **Context blindness** — A spec tool with no knowledge of the existing codebase generates guidance disconnected from the real constraints of the project.

LightSpec is designed to eliminate all three.

---

## Why Adaptive Rigor Is the Answer

The insight behind LightSpec is that **spec depth should be a function of project complexity, not developer ambition**. A 5-file Node.js utility does not need a product requirements document, a data flow diagram, and a 40-point acceptance checklist. It needs a clear problem statement, a concise approach, and three acceptance criteria. That is a micro spec. It takes 15 seconds to generate and 2 minutes to read.

Adaptive rigor means:

- **Measuring before generating** — LightSpec scans the project first, scores it on six dimensions of complexity, and selects a depth level automatically.
- **Right-sizing the output** — Micro specs are 200 lines. Standard specs are 500-1000 lines. Full specs are three focused files totaling ~2000 lines.
- **Defaulting to less, graduating to more** — It is easy to generate a larger spec if you need one. It is impossible to unsee a 50-page spec when you only needed a paragraph.

---

## LightSpec vs AutoSpec: Younger Brother, Not Competitor

LightSpec is AutoSpec's lightweight younger sibling. They share the same philosophical foundation — spec-driven development, living documentation, QA before done — but they serve different audiences and different moments in a project's life.

| Dimension | AutoSpec | LightSpec |
|-----------|----------|-----------|
| Generation time | 5-30 minutes | 15-90 seconds |
| Output size | 3-10 files, 2000-5000 lines | 1-3 files, 200-2000 lines |
| Target project | Greenfield SaaS, large teams | Brownfield apps, solo devs, quick tasks |
| Role system | 10 specialized roles | None — single unified pass |
| Context awareness | Manual SRS input | Automatic brownfield scan |
| Entry cost | High (requires full SRS) | Zero (scan any directory) |

The graduation path runs one way: `lsp graduate` converts a LightSpec output into a full AutoSpec project structure, promoting lightweight specs into role-based specs and creating the backlog. This means LightSpec is also an on-ramp to AutoSpec — teams can start lightweight and graduate as their project grows.

---

## Target Users

LightSpec is designed for:

1. **Developers working on legacy codebases** — No one wrote specs for this 8-year-old Rails app. LightSpec scans it, understands it, and generates a spec for the next feature without requiring anyone to document everything first.

2. **Solo developers and indie hackers** — Speed matters more than process coverage. LightSpec gives solo devs just enough structure to avoid costly mistakes without slowing them down.

3. **Teams with simple, well-scoped tasks** — Not every ticket needs a 10-role spec suite. A bug fix, a configuration change, or a minor feature improvement deserves a micro spec that takes 30 seconds to read.

4. **Teams evaluating AutoSpec** — LightSpec is a low-commitment introduction. Try it on a real project. If you need more, graduate.

---

## Core Principles

**Zero config.** `lsp init` in any directory should work. No configuration files, no environment variables, no setup ceremony. The scanner reads what is already there.

**Brownfield intelligence.** LightSpec starts by understanding, not by assuming. It scans your languages, frameworks, directory structure, route definitions, test files, and documentation before generating a single token.

**Graduation path.** LightSpec is not a dead end. `lsp graduate` is a first-class command that promotes your lightweight spec into full AutoSpec structure. LightSpec output is designed to map cleanly onto AutoSpec roles.

**Human-readable output.** Every LightSpec output file is plain Markdown with YAML frontmatter. No proprietary formats, no binary artifacts, no lock-in.

**Honest about limits.** LightSpec is not AutoSpec. It will not generate a comprehensive product vision, a database ERD, or a full QA test plan. For complex greenfield projects, you need AutoSpec. LightSpec says so, and provides the path.

---

## How LightSpec Relates to the Broader Ecosystem

The spec tooling market has several players worth acknowledging:

- **GSD (Get Stuff Done)** — Task-focused, lightweight, no brownfield awareness. LightSpec is similar in spirit but adds project context.
- **OpenSpec** — Strong on API specification (OpenAPI-first), weak on implementation planning. LightSpec covers the full development cycle, not just API contracts.
- **SpecIt** — Good greenfield support, poor brownfield support. LightSpec inverts this priority.

LightSpec occupies the gap between "no spec at all" and "full AutoSpec" — a gap that turns out to be where most real-world development happens.
