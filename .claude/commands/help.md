# Help — Sprint & Development Commands

Display available commands and workflow guidance.

## Instructions

When this command is invoked, display the following:

```
## LightSpec Development Commands

### Sprint Lifecycle
| Command | Description |
|---------|-------------|
| `/plan-sprint [goal]` | Assemble expert AI agents to plan a sprint (experts → 3-PM review → backlog) |
| `/sprint-run X` | Execute entire sprint: plan → implement → QA → docs → close |
| `/sprint-status X` | Show sprint progress with visual progress bar |
| `/sprint-close X` | Close sprint, generate summary with docs linkage |

### Ticket Operations
| Command | Description |
|---------|-------------|
| `/execute-ticket X.Y` | Execute a single ticket with QA + docs update |
| `/qa-review X.Y` | QA review a completed ticket or sprint |
| `/update-backlog [action]` | Add/update tickets, link docs, report bugs |
| `/create-spec [name]` | Generate a new feature specification |
| `/create-sprint-docs X` | Generate sprint summary documentation |

### Update Backlog Actions
| Action | Example |
|--------|---------|
| `status [ticket] [status]` | `/update-backlog status 38.3 done` |
| `add [sprint] [desc] [owner] [model]` | `/update-backlog add 38 "Add caching" Backend sonnet` |
| `bug [description]` | `/update-backlog bug "lsp init fails on monorepo"` |
| `note [ticket] [text]` | `/update-backlog note 38.3 "Needs provider key"` |
| `docs [ticket] [doc_paths]` | `/update-backlog docs 38.3 docs/cli/03_scanner.md` |

### Automatic Behavior (every task)
1. **Backlog-first**: Every change → ticket in `specs/backlog.md`
2. **Docs-first**: Read `docs/` before modifying code
3. **QA before done**: Run tests before marking ✅
4. **Living docs**: Update `docs/` after every feature

### Key Files
| File | Purpose |
|------|---------|
| `specs/backlog.md` | Sprint tickets (single source of truth) |
| `specs/01_product_manager.md` | Product vision and requirements |
| `specs/05_qa_lead.md` | QA standards and testing guidelines |
| `docs/` | Living documentation (architecture, flows, API, etc.) |
| `sprints/sprint-X/summary.md` | Sprint summaries with docs cross-references |
```
