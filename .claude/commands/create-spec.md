# Create Spec

Generate a new feature specification following the Spec-Driven Development template.

## Usage

```
/create-spec [feature_name]
```

**Example:** `/create-spec brownfield-go-support`

## Instructions

When this command is invoked:

1. **Gather requirements** from the user:
   - Ask clarifying questions about the feature
   - Understand the problem being solved
   - Identify constraints and dependencies

2. **Read existing specs** for context:
   - `specs/01_product_manager.md` - Product vision and principles
   - `specs/02_backend_lead.md` - CLI and scanner patterns
   - `specs/03_frontend_lead.md` - Presentation + viewer patterns
   - `specs/04_db_architect.md` - `.lsp/` output conventions

3. **Determine spec number**:
   - Check existing specs in `specs/` folder
   - Use next available number (e.g., 11, 12, etc.)
   - Feature specs start at 11+

4. **Generate spec document** with these sections:

```markdown
# SPEC: [Feature Name]

**Version:** 1.0
**Created:** [Date]
**Status:** Draft

---

## 1. Vision

### Problem Statement
What problem does this solve?

### Success State
What does success look like?

### Who Benefits
Which user personas benefit?

---

## 2. Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | [Requirement] | Must Have | |
| FR-2 | [Requirement] | Should Have | |

### Non-Functional Requirements

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-1 | Performance | lsp init completes in < 60s |
| NFR-2 | Correctness | Detection accuracy > 80% |

---

## 3. CLI Interface (if applicable)

| Command | Flags | Description |
|---------|-------|-------------|
| `lsp init` | `--flag value` | [description] |

---

## 4. Output Format (if applicable)

Changes to `.lsp/` directory structure or `spec.md` frontmatter.

---

## 5. Implementation Plan

### Scanner Changes (if applicable)
[New detection modules or changes to existing ones]

### Pipeline Changes (if applicable)
[New prompt templates or depth routing changes]

### Frontend Changes (if applicable)
[Presentation or viewer component changes]

---

## 6. Security Considerations

- [ ] No user credentials written to `.lsp/`
- [ ] No absolute paths exposed in output (use relative)
- [ ] LLM prompts don't include file contents (only metadata)

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Detection accuracy | > 80% |
| Time to spec | < 60s |
| Test coverage | > 80% |

---

## 8. Out of Scope

- [What this spec does NOT include]

---

## 9. Open Questions

- [ ] [Question to resolve]
```

5. **Save the spec**:
   - Write to `specs/XX_feature_name.md`

6. **Generate initial tickets**:
   - Break the spec into 2-4 hour tickets
   - Present as a draft sprint

## Important Rules

- Always ask clarifying questions before writing
- Follow naming conventions from existing specs
- Include concrete examples, not placeholders
- Break down into implementable, testable pieces
- Mark spec as "Draft" until validated
