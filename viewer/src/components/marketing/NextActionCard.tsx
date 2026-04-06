import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card'
import { Badge } from '../primitives/Badge'
import { ArrowRight, Lock } from 'lucide-react'
import { resolveBlockers } from '../../data/marketing'
import type { MarketingData } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NextActionCardProps {
  data: MarketingData
  launchLive: boolean
  /** If true, treat ms-2 as done in blocker resolution */
  overrideMilestones?: Record<string, boolean>
}

interface ActionItem {
  id: string
  label: string
  type: 'post' | 'article' | 'milestone'
  week: number
  description: string
}

// ─── Helper: build override-aware data ───────────────────────────────────────

function buildEffectiveData(
  data: MarketingData,
  launchLive: boolean,
  overrideMilestones: Record<string, boolean>,
): MarketingData {
  if (!launchLive) return data
  return {
    ...data,
    milestones: data.milestones.map(m => ({
      ...m,
      done: overrideMilestones[m.id] !== undefined ? overrideMilestones[m.id] : m.done,
    })),
  }
}

// ─── Helper: find next unblocked action ──────────────────────────────────────

function findNextAction(
  data: MarketingData,
  launchLive: boolean,
  overrideMilestones: Record<string, boolean>,
): ActionItem | null {
  const effective = buildEffectiveData(data, launchLive, overrideMilestones)

  // Collect all candidate items sorted by week ascending
  const candidates: ActionItem[] = [
    ...effective.posts
      .filter(p => p.status !== 'published')
      .map(p => ({
        id: p.id,
        label: `${p.arc} — Week ${p.week}`,
        type: 'post' as const,
        week: p.week,
        description: p.hook,
      })),
    ...effective.articles
      .filter(a => a.status !== 'published')
      .map(a => ({
        id: a.id,
        label: a.title,
        type: 'article' as const,
        week: a.week,
        description: `${a.wordCount} words · ${a.platform}`,
      })),
    ...effective.milestones
      .filter(m => !m.done)
      .map(m => ({
        id: m.id,
        label: m.item,
        type: 'milestone' as const,
        week: 0,
        description: `${m.phase}${m.dueDate ? ' · ' + m.dueDate : ''}`,
      })),
  ].sort((a, b) => a.week - b.week)

  // Return first item with all blockers resolved
  return candidates.find(item => resolveBlockers(effective, item.id)) ?? null
}

// ─── NextActionCard ───────────────────────────────────────────────────────────

export const NextActionCard: React.FC<NextActionCardProps> = ({
  data,
  launchLive,
  overrideMilestones = {},
}) => {
  const next = findNextAction(data, launchLive, overrideMilestones)

  // Pre-launch gate: ms-2 (npm publish) not done and not live mode
  const ms2 = data.milestones.find(m => m.id === 'ms-2')
  const ms2Done = overrideMilestones['ms-2'] !== undefined ? overrideMilestones['ms-2'] : (ms2?.done ?? false)
  const showGate = !launchLive && !ms2Done

  const typeLabel = next
    ? { post: 'LinkedIn Post', article: 'Article', milestone: 'Milestone' }[next.type]
    : null

  const typeBadgeVariant = next
    ? ({ post: 'in-progress', article: 'todo', milestone: 'done' } as const)[next.type]
    : ('todo' as const)

  return (
    <Card variant="default" className="border border-sage/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ArrowRight size={16} className="text-sage" style={{ color: '#698472' }} />
          <CardTitle className="text-base">Next Action</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {showGate ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-sand-200">
            <Lock size={16} className="text-sand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">Waiting for npm publish (ms-2)</p>
              <p className="text-xs text-sand-600 mt-1">
                Complete ms-1 (README fix), then publish to npm. Once ms-2 is done, the launch sequence
                unlocks. Toggle "Set Live" to preview the post-launch view.
              </p>
            </div>
          </div>
        ) : next ? (
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={typeBadgeVariant} size="sm">{typeLabel}</Badge>
                <span className="text-xs text-sand-600">{next.id}</span>
              </div>
              <p className="text-sm font-medium text-charcoal leading-snug">{next.label}</p>
              <p className="text-xs text-sand-600 mt-1">{next.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-sand-600">All items are complete or blocked. Great work!</p>
        )}
      </CardContent>
    </Card>
  )
}

export default NextActionCard
