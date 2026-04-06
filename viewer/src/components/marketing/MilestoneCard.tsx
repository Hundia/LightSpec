import React from 'react'
import { Card, CardContent } from '../primitives/Card'
import type { LaunchMilestone } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MilestoneCardProps {
  milestone: LaunchMilestone
  isBlocked: boolean
  onToggle: (id: string) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const phaseStyles: Record<LaunchMilestone['phase'], { bg: string; text: string }> = {
  'Pre-launch': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'Launch': { bg: 'bg-sage/20', text: 'text-sage' },
  'Post-launch': { bg: 'bg-terracotta/20', text: 'text-terracotta' },
}

// ─── MilestoneCard ────────────────────────────────────────────────────────────

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, isBlocked, onToggle }) => {
  const phaseStyle = phaseStyles[milestone.phase]

  return (
    <Card variant="outlined" className={isBlocked && !milestone.done ? 'opacity-70' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Done checkbox */}
          <button
            onClick={() => onToggle(milestone.id)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 transition-all flex items-center justify-center ${
              milestone.done
                ? 'bg-sage border-sage text-cream'
                : 'border-sand-400 bg-cream hover:border-sage'
            }`}
            aria-label={milestone.done ? 'Mark as not done' : 'Mark as done'}
          >
            {milestone.done && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Phase + due date */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${phaseStyle.bg} ${phaseStyle.text}`}>
                {milestone.phase}
              </span>
              {milestone.dueDate && (
                <span className="text-xs text-sand-600">{milestone.dueDate}</span>
              )}
              {isBlocked && !milestone.done && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Blocked</span>
              )}
            </div>

            {/* Item text */}
            <p className={`text-sm leading-snug ${milestone.done ? 'line-through text-sand-500' : 'text-charcoal'}`}>
              {milestone.item}
            </p>

            {/* blockedBy chips */}
            {milestone.blockedBy.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-sand-600">Blocked by:</span>
                {milestone.blockedBy.map(id => (
                  <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MilestoneCard
