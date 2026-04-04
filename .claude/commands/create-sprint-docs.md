# Create Sprint Docs

Generate documentation for completed sprints.

## Usage

```
/create-sprint-docs [sprint_number]
```

**Example:** `/create-sprint-docs 38`

## Instructions

When this command is invoked:

1. **Verify sprint is complete**:
   - Read `specs/backlog.md`
   - Ensure all tickets are ✅ Done
   - If not complete, warn user

2. **Gather sprint data**:
   - Sprint name and goal
   - All tickets with final status
   - Files changed (via git)
   - Test results

3. **Create sprint folder**:
   - Create `sprints/sprint-XX/`

4. **Generate three documents**:

### Document 1: summary.md

```markdown
# Sprint [X]: [Name]

**Date:** [Completion Date]
**Status:** ✅ Complete
**QA:** [X/X Tests Passed](./qa-results.md)

## Goal
[Sprint goal from backlog]

## What's New (User-Facing)
- [Feature 1]: [Brief description]

## Technical Summary

### CLI Changes
| File | Change |
|------|--------|
| `cli/src/...` | [description] |

### Presentation Changes
| File | Change |
|------|--------|
| `presentation/src/...` | [description] |

### Viewer Changes
| File | Change |
|------|--------|
| `viewer/src/...` | [description] |

## Breaking Changes
- [Description, or "None"]

## Dependencies Added
- [Package: version, or "None"]

## Tickets Completed
| # | Ticket | Owner |
|---|--------|-------|
| X.1 | [Description] | [Role] |

## Notes
[Any important notes for future reference]
```

### Document 2: qa-results.md

```markdown
# Sprint [X]: QA Test Results

**Date:** [Date]
**Result:** ✅ [X/X] Tests Passed

## Test Summary
| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Unit (scanner) | X | 0 | 0 |
| Unit (pipeline) | X | 0 | 0 |
| Integration | X | 0 | 0 |
| E2E | X | 0 | 0 |
| Build (cli) | ✅ | — | — |
| Build (presentation) | ✅ | — | — |
| Build (viewer) | ✅ | — | — |
| **Total** | **X** | **0** | **0** |

## Coverage Report
| Module | Coverage | Target |
|--------|----------|--------|
| scanner/ | X% | 80% |
| pipeline/ | X% | 80% |

## Issues Found & Resolved
| Issue | Severity | Ticket | Resolution |
|-------|----------|--------|------------|
| [Description] | [H/M/L] | B.X | [How fixed] |

## Known Limitations
- [Any known issues not blocking release]
```

### Document 3: release-notes.md

```markdown
# Sprint [X]: [Name]

**Release Date:** [Date]

---

## What's New

### [Feature 1 Name]
[User-friendly description]

---

## Improvements
- [Improvement 1]

---

## Bug Fixes
- Fixed: [Bug description, if any]

---

## Coming Soon
[Teaser for next sprint]
```

5. **Update backlog**:
   - Mark sprint status to ✅ Done
   - Add link to sprint docs

## Important Rules

- Don't generate docs for incomplete sprints
- Use git diff to find actual file changes
- Run tests to get real coverage numbers
- Release notes should be user-friendly, not technical
