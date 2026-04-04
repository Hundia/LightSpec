# Execute Ticket

Execute a ticket from the backlog following Spec-Driven Development methodology.

## Usage

```
/execute-ticket [ticket_number]
```

**Example:** `/execute-ticket 38.5`

## Instructions

**Note:** When running inside an Orchestrator+Agent session, the agent briefing file (`agents/sprint-X-brief.md`) takes precedence over interactive backlog discovery. Read it first.

When this command is invoked:

1. **Read the backlog** to find the specified ticket:
   - Read `specs/backlog.md`
   - Locate the ticket by number (e.g., 38.5 = Sprint 38, Ticket 5)
   - Note the ticket's owner, status, and dependencies

2. **Check dependencies**:
   - Verify prerequisite tickets are marked ✅ Done
   - If dependencies are incomplete, notify the user and stop

3. **Read relevant docs FIRST** (before touching code):
   - Check `docs/` for existing documentation related to this ticket's subsystem
   - Understanding existing architecture prevents rework and regressions

4. **Update backlog status**:
   - Change ticket status from 🔲 Todo to 🔄 In Progress

5. **Read relevant spec file** based on ticket type:
   - Backend/CLI tickets → `specs/02_backend_lead.md`
   - Frontend/presentation tickets → `specs/03_frontend_lead.md`
   - Viewer tickets → `specs/03_frontend_lead.md`
   - Storage/output tickets → `specs/04_db_architect.md`
   - DevOps tickets → `specs/06_devops_lead.md`
   - QA tickets → `specs/05_qa_lead.md`
   - UI tickets → `specs/10_ui_designer.md`

6. **Implement the ticket**:
   - Follow patterns and conventions from the relevant spec files
   - Write clean, typed TypeScript following project standards
   - Add appropriate error handling

7. **QA Verification** (MANDATORY — scale to change type):

   | Change Type | QA Required |
   |-------------|-------------|
   | Bug fix | Reproduce bug first, apply fix, verify the exact user flow passes |
   | CLI change | `cd cli && npm run build && npm test` |
   | Presentation change | `cd presentation && npm run build` + visual check |
   | Viewer change | `cd viewer && npm run build` + visual check |
   | Docs/config only | No QA needed — mark ✅ directly |
   | Full feature | Full test suite + new test cases |

   ```bash
   # CLI tests
   cd cli && npm run build && npx vitest run

   # Presentation build
   cd presentation && npm run build

   # Viewer build
   cd viewer && npm run build
   ```

8. **Update documentation** (MANDATORY):
   - CLI changes → `docs/cli/`
   - Presentation changes → `docs/presentation/` (create if needed)
   - Viewer changes → `docs/viewer/`

9. **Update backlog with final status**:
   - If QA passes: Change status to ✅ Done (or 🧪 QA Review if user verification needed)
   - Add docs references to the ticket's Docs column
   - If blocked: Change to ⏸️ Blocked with a note

## Output Format

```
## Executing Ticket [X.X]: [Description]

### Dependencies Check
- [x] Ticket X.1 ✅ Done
- [x] Ticket X.2 ✅ Done

### Implementation
[Description of what was implemented]

### Files Changed
| File | Change |
|------|--------|
| `presentation/src/components/slides/LiveDemoSlide.tsx` | Created |

### QA Results
| Check | Result | Notes |
|-------|--------|-------|
| Build | ✅ | cd presentation && npm run build → exit 0 |
| Visual | ✅ | Slide renders in PresentationPage |

### Documentation Updated
| Doc File | Change |
|----------|--------|
| `docs/presentation/slides.md` | Added LiveDemoSlide |

### Status Updated
🔲 Todo → 🔄 In Progress → ✅ Done
```

## Important Rules

- Always read docs and spec files before implementing
- Follow existing code patterns in the project
- Update backlog.md status immediately after each phase
- Never skip the dependencies check
- Never skip QA (unless docs/config only)
- Never skip documentation updates
- If blocked, update status to ⏸️ Blocked with a note
