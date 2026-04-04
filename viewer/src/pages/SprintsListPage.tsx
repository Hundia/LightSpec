import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { backlogData } from '../data/backlog'
import type { BadgeVariant } from '../components/primitives/Badge'
import type { TicketStatus } from '../data/backlog'

function statusToBadgeVariant(status: TicketStatus): BadgeVariant {
  switch (status) {
    case 'done': return 'done'
    case 'todo': return 'todo'
    case 'in-progress': return 'in-progress'
    case 'blocked': return 'blocked'
    case 'qa': return 'qa'
    default: return 'default'
  }
}

function statusLabel(status: TicketStatus): string {
  switch (status) {
    case 'done': return 'Done'
    case 'todo': return 'Todo'
    case 'in-progress': return 'In Progress'
    case 'blocked': return 'Blocked'
    case 'qa': return 'QA Review'
    default: return status
  }
}

export const SprintsListPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">All Sprints</h2>
        <p className="text-sm text-sand-600 mt-1">
          {backlogData.length} sprints — {backlogData.reduce((sum, s) => sum + s.totalPoints, 0)} total points
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {backlogData.map(sprint => {
          const doneTickets = sprint.tickets.filter(t => t.status === 'done').length
          const actualTotal = sprint.tickets.reduce((sum, t) => sum + t.points, 0)
          const donePoints = sprint.tickets.filter(t => t.status === 'done').reduce((sum, t) => sum + t.points, 0)

          return (
            <Card
              key={sprint.number}
              variant="outlined"
              hoverable
              clickable
              onClick={() => navigate(`/sprint/${sprint.number}`)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-charcoal">Sprint {sprint.number}</span>
                  <Badge variant={statusToBadgeVariant(sprint.status)} size="sm">
                    {statusLabel(sprint.status)}
                  </Badge>
                </div>
                <div className="text-xs font-medium text-charcoal mb-1">{sprint.name}</div>
                <p className="text-xs text-sand-600 mb-3">{sprint.theme}</p>
                <div className="flex items-center justify-between text-xs text-sand-500">
                  <span>{donePoints}/{actualTotal} pts</span>
                  <span>{doneTickets}/{sprint.tickets.length} tickets</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-sand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage rounded-full transition-all"
                    style={{ width: `${actualTotal > 0 ? (donePoints / actualTotal) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
