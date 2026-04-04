import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { ProgressRing } from '../components/charts/ProgressRing'
import { DependencyGraph } from '../components/diagrams/DependencyGraph'
import { SequenceDiagram } from '../components/diagrams/SequenceDiagram'
import { SprintTimeline } from '../components/diagrams/SprintTimeline'
import { AgentCapabilityRadar } from '../components/diagrams/AgentCapabilityRadar'
import { FlowDiagram } from '../components/diagrams/FlowDiagram'
import { sprintVisualizations } from '../data/sprints'
import { backlogData } from '../data/backlog'
import type { BadgeVariant } from '../components/primitives/Badge'
import type { TicketStatus } from '../data/backlog'

type TabId = 'overview' | 'planning' | 'retrospective' | 'tickets'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'planning', label: 'Planning', icon: '🔄' },
  { id: 'retrospective', label: 'Retrospective', icon: '📅' },
  { id: 'tickets', label: 'Tickets', icon: '🎫' },
]

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

export const SprintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const viz = id ? sprintVisualizations[id] : undefined
  const sprint = backlogData.find(s => s.number === id)

  if (!sprint && !viz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-light text-charcoal">Sprint not found</h2>
        <p className="text-sm text-sand-600">No sprint with ID "{id}" exists in the backlog or visualization data.</p>
      </div>
    )
  }

  const title = viz?.title || sprint?.theme || `Sprint ${id}`
  const totalPoints = sprint?.totalPoints || 0
  const tickets = sprint?.tickets || []
  const donePoints = tickets.filter(t => t.status === 'done').reduce((sum, t) => sum + t.points, 0)
  const totalTickets = tickets.length
  const owners = [...new Set(tickets.map(t => t.owner))]

  const planning = viz?.planning
  const retro = viz?.retrospective

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-light text-charcoal">Sprint {id}</h2>
          {sprint && <Badge variant={statusToBadgeVariant(sprint.status)}>{statusLabel(sprint.status)}</Badge>}
        </div>
        <p className="text-sm text-sand-600 mt-1">
          {title} — {totalPoints} points, {totalTickets} tickets
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-sand-200 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cream shadow-subtle text-charcoal font-medium'
                : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <ProgressRing value={donePoints} max={totalPoints || 1} size={72} label="Progress" />
                <div className="text-xs text-sand-600 mt-1">{donePoints}/{totalPoints} pts</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">{totalTickets}</div>
                <div className="text-xs text-sand-600 mt-1">Tickets</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">{totalPoints}</div>
                <div className="text-xs text-sand-600 mt-1">Points</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">{owners.length}</div>
                <div className="text-xs text-sand-600 mt-1">Owners</div>
              </CardContent>
            </Card>
          </div>

          {planning?.overview && (
            <Card>
              <CardHeader>
                <CardTitle>Sprint Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-charcoal leading-relaxed">{planning.overview}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Planning tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {!planning ? (
            <Card variant="outlined">
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm text-sand-600">No planning data available for this sprint.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {planning.flowSteps && planning.flowConnections && (
                <Card>
                  <CardHeader>
                    <CardTitle>Planning Flow</CardTitle>
                    <CardDescription>Step-by-step planning workflow with decision points and feedback loops.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FlowDiagram steps={planning.flowSteps} connections={planning.flowConnections} />
                  </CardContent>
                </Card>
              )}

              {planning.dependencyGraph && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dependency Graph</CardTitle>
                    <CardDescription>Interactive dependency DAG. Hover to highlight connections, click for details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DependencyGraph
                      nodes={planning.dependencyGraph.nodes}
                      edges={planning.dependencyGraph.edges}
                      width={780}
                      height={340}
                    />
                  </CardContent>
                </Card>
              )}

              {planning.sequenceDiagram && (
                <Card>
                  <CardHeader>
                    <CardTitle>Planning Sequence</CardTitle>
                    <CardDescription>
                      The multi-phase planning workflow. Solid arrows = synchronous. Dashed arrows = returns. Open arrows = parallel async.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SequenceDiagram
                      actors={planning.sequenceDiagram.actors}
                      messages={planning.sequenceDiagram.messages}
                      activations={planning.sequenceDiagram.activationBars}
                    />
                  </CardContent>
                </Card>
              )}

              {planning.architectureNotes && (
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Architecture Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{planning.architectureNotes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Retrospective tab */}
      {activeTab === 'retrospective' && (
        <div className="space-y-6">
          {!retro ? (
            <Card variant="outlined">
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-sm text-sand-600">No retrospective data available for this sprint.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {retro.timeline && (
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Timeline</CardTitle>
                    <CardDescription>Gantt-style view of sprint phases. Parallel tracks show concurrent work.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SprintTimeline
                      phases={retro.timeline.phases}
                      milestones={retro.timeline.milestones}
                      columns={retro.timeline.columns}
                      totalRows={retro.timeline.totalRows}
                    />
                  </CardContent>
                </Card>
              )}

              {retro.agentRadar && (
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Capability Comparison</CardTitle>
                    <CardDescription>Radar chart comparing AI coding agents. Click names to toggle visibility.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AgentCapabilityRadar
                      agents={retro.agentRadar.agents}
                      axes={retro.agentRadar.axes}
                      size={320}
                    />
                  </CardContent>
                </Card>
              )}

              {retro.keyMetrics && retro.keyMetrics.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {retro.keyMetrics.map(metric => (
                    <Card key={metric.label} variant="outlined">
                      <CardContent className="py-4 text-center">
                        <div className="text-3xl font-bold text-charcoal">{metric.value}</div>
                        <div className="text-xs text-sand-600 mt-1">{metric.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {(retro.highlights || retro.challenges) && (
                <div className="grid grid-cols-2 gap-6">
                  {retro.highlights && retro.highlights.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Highlights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {retro.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                              <span className="text-sage mt-0.5 flex-shrink-0">+</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {retro.challenges && retro.challenges.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Challenges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {retro.challenges.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                              <span className="text-terracotta mt-0.5 flex-shrink-0">!</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {retro.completedAt && (
                <p className="text-xs text-sand-500 text-right">Completed: {retro.completedAt}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Tickets tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <Card variant="outlined">
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-3">🎫</div>
                <p className="text-sm text-sand-600">No ticket data available for this sprint.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Tickets</CardTitle>
                <CardDescription>{totalTickets} tickets, {totalPoints} points total</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sand-200">
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Owner</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Pts</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Deps</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="border-t border-sand hover:bg-sand-100">
                        <td className="px-4 py-2.5 font-mono text-xs text-sage-700 font-semibold">{ticket.id}</td>
                        <td className="px-4 py-2.5 text-charcoal">{ticket.title}</td>
                        <td className="px-4 py-2.5 text-sand-600 text-xs">{ticket.owner}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="default" size="sm">{ticket.points} pt</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-sand-500 font-mono">
                          {ticket.dependencies.length > 0 ? ticket.dependencies.join(', ') : '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant={statusToBadgeVariant(ticket.status)} size="sm">{statusLabel(ticket.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
