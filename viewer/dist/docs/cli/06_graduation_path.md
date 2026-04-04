---
title: Graduation Path — LightSpec to AutoSpec
sprint: 37
created: 2026-03-27
---

# Graduation Path

## When to Graduate

LightSpec is designed for projects where a single developer or a small team needs a spec fast. Graduation to AutoSpec is the right move when:

- **Team grows** — more than 3 developers sharing a spec means role-specific clarity becomes important. AutoSpec's 10-role structure maps cleanly to team responsibilities.
- **Project complexity grows** — complexity score consistently hits 80+ across scans. The project has multiple subsystems, a significant API surface, a frontend, and a database. Full AutoSpec decomposition becomes worth the upfront investment.
- **Enterprise requirements** — stakeholders need role-sign-off, audit trails, or cross-team reviews. AutoSpec's role specs provide clear ownership.
- **Sprint cadence matures** — once you're running regular sprints tracked in a backlog, AutoSpec's full toolchain (sprint-run, sprint-status, sprint-close) offers structured iteration.
- **All tasks complete** — `lsp status` shows 100% completion. The project has been built from the LightSpec spec. A natural pause before the next major phase is a good graduation moment.

Graduating early is harmless — stubs are provided for roles 06-10. Graduating too late just means you've been manually maintaining a single spec that should be decomposed.

---

## What `lsp graduate` Does

The `graduate` command performs a one-time migration from `.lsp/` output to a full AutoSpec project structure. It:

1. Reads all spec files from `.lsp/` (spec.md, or product.md + technical.md + quality.md)
2. Extracts relevant sections by heading name
3. Maps extracted content to the 10 AutoSpec role spec files in `specs/`
4. Converts `tasks.md` to `specs/backlog.md`
5. Creates a `CLAUDE.md` template with project memory rules
6. Prints next steps for the team

The original `.lsp/` directory is preserved — it serves as a reference for the generated spec content and as provenance for the graduation mapping.

---

## The Section → Role Mapping

| LightSpec Section (heading) | AutoSpec Role | Output File |
|-----------------------------|---------------|-------------|
| Overview / Vision / Problem | Product Manager | `specs/01_product_manager.md` |
| Technical Design / Architecture | Backend Lead | `specs/02_backend_lead.md` |
| Frontend / UI / User Interface | Frontend Lead | `specs/03_frontend_lead.md` |
| Data Model / Schema / Database | DB Architect | `specs/04_db_architect.md` |
| Testing / Test Strategy / Quality | QA Lead | `specs/05_qa_lead.md` |
| _(stub)_ | DevOps Lead | `specs/06_devops_lead.md` |
| _(stub)_ | Security Lead | `specs/07_security_lead.md` |
| _(stub)_ | Data Engineer | `specs/08_data_engineer.md` |
| _(stub)_ | Tech Writer | `specs/09_tech_writer.md` |
| _(stub)_ | Project Manager | `specs/10_project_manager.md` |

Heading matching is case-insensitive and uses substring search. If a matching section is not found, a placeholder pointing to `.lsp/spec.md` is inserted instead. This means graduation always produces a valid AutoSpec structure, even for sparse specs.

---

## YAML Frontmatter in Graduated Specs

Every graduated spec file includes YAML frontmatter to mark its origin:

```yaml
---
role: product_manager
generated_by: lightspec-graduate
source: .lsp/spec.md
date: 2026-03-27
status: draft
---
```

The `status: draft` flag signals to the team that these specs need human review before being treated as authoritative. Roles 06-10 additionally contain an inline TODO comment directing the team to run `autospec generate <srs>` to expand them.

---

## What Stays, What Gets Regenerated

**Stays as-is:**
- Content mapped from LightSpec sections (01-05) — this is the authoritative product and technical intent from the original spec
- `specs/backlog.md` — tasks converted from `tasks.md`, ready for sprint planning
- `CLAUDE.md` — project memory rules (edit to match your team's workflow)
- `.lsp/` — preserved for reference and audit trail

**Should be regenerated / expanded:**
- Stubs in roles 06-10 — use `autospec generate <srs>` to fill DevOps, Security, Data, Docs, and PM roles
- `specs/backlog.md` sprint structure — the initial backlog has a single Sprint 1; add proper sprint breakdowns
- `CLAUDE.md` — the template is minimal; add your actual project URL, tech stack, and development rules

---

## Next Steps After Graduation

1. **Review `specs/01_product_manager.md`** — verify the Overview and goals match your intent. This becomes the source of truth for all other roles.

2. **Expand stubs (roles 06-10)** — if you have an SRS document, run `autospec generate <srs>` to fill all 10 roles automatically. Otherwise, edit the stubs manually.

3. **Structure your backlog** — `specs/backlog.md` has a flat Sprint 1. Break it into proper sprint tickets with story points and acceptance criteria.

4. **Create `docs/` directories** — AutoSpec expects `docs/<subsystem>/` directories. Start with the subsystems identified in your `02_backend_lead.md`.

5. **Configure `CLAUDE.md`** — add your project's environment URLs, build commands, and development workflow rules. This is what Claude Code reads at the start of every session.

---

## The AutoSpec Family Continuum

```
lsp init                     lsp graduate               autospec generate
    │                              │                           │
    ▼                              ▼                           ▼
.lsp/spec.md          specs/ (10 role files)      specs/ (fully expanded)
tasks.md              backlog.md (flat)            backlog.md (sprints)
.meta.json            CLAUDE.md (stub)             CLAUDE.md (full)
    │                              │                           │
15-90 seconds              2-5 minutes             15-30 minutes
1 person                   2-5 people              5+ people / enterprise
```

LightSpec and AutoSpec are complementary, not competing. LightSpec gets you to a working spec in under 2 minutes for small-to-medium work. AutoSpec provides the full SDD ceremony for complex, multi-team projects. Graduation is the bridge — you decide when the project has grown enough to warrant the upgrade.
