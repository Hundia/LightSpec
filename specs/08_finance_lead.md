# Finance Lead Spec — LightSpec

## License

**MIT License**

LightSpec is fully open source. Anyone can use, modify, and distribute it without restriction. This is intentional — the goal is adoption, not monetization.

---

## Infrastructure Costs

| Service | Usage | Monthly Cost |
|---------|-------|-------------|
| GitHub (repo, Actions, Pages) | Free tier | $0 |
| npm registry (public package) | Free | $0 |
| Domain (if custom) | Optional | ~$12/year |
| **Total** | | **$0–$1/month** |

LightSpec has no server, no database, no cloud functions. All compute happens on the user's machine.

---

## LLM Costs (User-Side)

LightSpec uses the user's own LLM credentials:
- **Claude Code** — billed to user's Anthropic account or subscription
- **Anthropic API** — `$0.003/1K tokens` (Haiku) to `$0.015/1K tokens` (Sonnet 3.5)
- **Gemini CLI** — free tier available

Estimated cost per `lsp init` call:
| Depth | Tokens (approx) | Anthropic Haiku cost |
|-------|----------------|---------------------|
| Micro | ~500 in + ~1K out | < $0.01 |
| Standard | ~1K in + ~2K out | < $0.02 |
| Full | ~2K in + ~5K out | < $0.05 |

Users running `lsp init` daily on 5 projects: < $1/month at API prices. Claude Code subscription users: $0 marginal cost.

---

## Revenue Model

**None planned for v1.**

LightSpec is a developer tool, part of the AutoSpec open-source family. The value is in adoption and ecosystem building, not direct monetization.

### Potential Future Paths (not planned)

| Model | Description | Likelihood |
|-------|-------------|------------|
| GitHub Sponsors | Community support for ongoing development | Possible |
| AutoSpec upsell | LightSpec → `lsp graduate` → paid AutoSpec features | Possible |
| Enterprise support | Bulk licensing for teams, private registry | Low |
| Hosted playground | Web UI, no local install | Low |

---

## Budget: Sprint Development

Each sprint is developed using Claude Code (Sonnet 4.6 agents). Rough cost estimate per sprint:

| Sprint complexity | Context tokens | Estimated Anthropic cost |
|------------------|----------------|--------------------------|
| Small (< 20 pts) | ~50K | ~$3 |
| Medium (20-50 pts) | ~150K | ~$10 |
| Large (50+ pts) | ~300K | ~$20 |

Sprint 37 (134 pts, founding sprint): ~$30 estimated.
Sprint 38 (52 pts, polish): ~$15 estimated.
