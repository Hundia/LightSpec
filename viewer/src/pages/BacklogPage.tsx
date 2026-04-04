import React, { useState } from 'react'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { backlogData, type TicketStatus, type Sprint } from '../data/backlog'

const statusColumns: { status: TicketStatus; label: string; emoji: string }[] = [
  { status: 'todo', label: 'Todo', emoji: '🔲' },
  { status: 'in-progress', label: 'In Progress', emoji: '🔄' },
  { status: 'qa', label: 'QA Review', emoji: '🧪' },
  { status: 'done', label: 'Done', emoji: '✅' },
  { status: 'blocked', label: 'Blocked', emoji: '❌' },
]

const statusVariant: Record<TicketStatus, 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'> = {
  todo: 'todo',
  'in-progress': 'in-progress',
  qa: 'qa',
  done: 'done',
  blocked: 'blocked',
}

function TicketCard({ ticket }: { ticket: Sprint['tickets'][0] }) {
  return (
    <div className="bg-cream border border-sand rounded-lg p-3 mb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-sand-600 mb-0.5">{ticket.id}</div>
          <div className="text-sm text-charcoal leading-snug">{ticket.title}</div>
          {ticket.dependencies.length > 0 && (
            <div className="text-xs text-sand-500 mt-1">
              Deps: {ticket.dependencies.join(', ')}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge variant={statusVariant[ticket.status]} size="sm">
            {ticket.points}pt
          </Badge>
          <div className="text-xs text-sand-500">{ticket.owner}</div>
        </div>
      </div>
    </div>
  )
}

export const BacklogPage: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  const allTickets = backlogData.flatMap(sprint =>
    sprint.tickets.map(t => ({ ...t, sprint: sprint.name }))
  )

  const totalPoints = backlogData.reduce((sum, s) => sum + s.totalPoints, 0)
  const donePoints = backlogData
    .filter(s => s.status === 'done')
    .reduce((sum, s) => sum + s.totalPoints, 0)

  if (view === 'table') {
    return (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light text-charcoal">Backlog</h2>
            <p className="text-sm text-sand-600 mt-1">{totalPoints} pts total · {donePoints} done</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-sand-200 text-charcoal hover:bg-sand-300">Kanban</button>
            <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-sage text-cream">Table</button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Sprint</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Owner</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Pts</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTickets.map(ticket => (
                  <tr key={ticket.id} className="border-t border-sand hover:bg-sand-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-sand-600">{ticket.id}</td>
                    <td className="px-4 py-2.5 text-charcoal">{ticket.title}</td>
                    <td className="px-4 py-2.5 text-sand-600 text-xs">{ticket.sprint}</td>
                    <td className="px-4 py-2.5 text-sand-600 text-xs">{ticket.owner}</td>
                    <td className="px-4 py-2.5 text-charcoal">{ticket.points}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={statusVariant[ticket.status]} size="sm">
                        {ticket.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Kanban view
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-charcoal">Backlog</h2>
          <p className="text-sm text-sand-600 mt-1">{totalPoints} pts total · {donePoints} done</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-sage text-cream">Kanban</button>
          <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-sand-200 text-charcoal hover:bg-sand-300">Table</button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map(col => {
          const tickets = allTickets.filter(t => t.status === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <span>{col.emoji}</span>
                <span className="text-sm font-medium text-charcoal">{col.label}</span>
                <span className="ml-auto text-xs bg-sand-200 text-sand-600 px-2 py-0.5 rounded-full">
                  {tickets.length}
                </span>
              </div>
              <div className="min-h-32">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-8 text-xs text-sand-400 border-2 border-dashed border-sand-200 rounded-lg">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
