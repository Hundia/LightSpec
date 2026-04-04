import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { AnimatedCounter } from '../components/charts/AnimatedCounter'
import { ProgressRing } from '../components/charts/ProgressRing'
import { backlogData } from '../data/backlog'
import type { BadgeVariant } from '../components/primitives/Badge'
import type { TicketStatus } from '../data/backlog'

// Derive all data from backlog
const sprintData = backlogData.map(s => ({
  sprint: `S${s.number}`,
  points: s.totalPoints,
  tickets: s.tickets.length,
  status: s.status,
  number: s.number,
  theme: s.theme,
}))

const totalPoints = backlogData.reduce((sum, s) => sum + s.totalPoints, 0)
const totalTickets = backlogData.reduce((sum, s) => sum + s.tickets.length, 0)
const totalSprints = backlogData.length
const donePoints = backlogData.reduce((sum, s) =>
  sum + s.tickets.filter(t => t.status === 'done').reduce((ts, t) => ts + t.points, 0), 0)

const statusCounts = backlogData.reduce((acc, s) => {
  s.tickets.forEach(t => {
    acc[t.status] = (acc[t.status] || 0) + 1
  })
  return acc
}, {} as Record<string, number>)

const statusData = [
  { name: 'Done', value: statusCounts['done'] || 0, color: '#698472' },
  ...(statusCounts['in-progress'] ? [{ name: 'In Progress', value: statusCounts['in-progress'], color: '#f59e0b' }] : []),
  ...(statusCounts['todo'] ? [{ name: 'Planned', value: statusCounts['todo'], color: '#d8d0ba' }] : []),
  ...(statusCounts['blocked'] ? [{ name: 'Blocked', value: statusCounts['blocked'], color: '#ef4444' }] : []),
]

const completionPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0

function statusToBadgeVariant(status: TicketStatus): BadgeVariant {
  switch (status) {
    case 'done': return 'done'
    case 'todo': return 'todo'
    case 'in-progress': return 'in-progress'
    default: return 'default'
  }
}

function statusLabel(status: TicketStatus): string {
  switch (status) {
    case 'done': return 'Done'
    case 'todo': return 'Planned'
    case 'in-progress': return 'In Progress'
    default: return status
  }
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">LightSpec Overview</h2>
        <p className="text-sm text-sand-600 mt-1">Just enough spec, just fast enough</p>
      </div>

      {/* Quick Start CTA */}
      <Card className="border-sage/30 bg-sage/5">
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-charcoal">New to LightSpec?</h3>
            <p className="text-xs text-sand-600 mt-0.5">Get started in 60 seconds with our step-by-step guide</p>
          </div>
          <button
            onClick={() => navigate('/quickstart')}
            className="px-4 py-2 bg-sage text-cream text-sm rounded-lg hover:bg-sage-700 transition-colors"
          >
            Quick Start →
          </button>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={totalPoints} label="Total Points" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={totalTickets} label="Total Tickets" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={totalSprints} label="Sprints" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={10} label="Role Specs" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4 flex flex-col items-center">
            <ProgressRing value={donePoints} max={totalPoints} size={56} color="#698472" />
            <div className="text-xs text-sand-600 mt-1">{completionPct}% Done</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Points per Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sprintData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: '#b8a890' }} />
                <YAxis tick={{ fontSize: 12, fill: '#b8a890' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {sprintData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.status === 'done' ? '#698472' : entry.status === 'in-progress' ? '#f59e0b' : '#d8d0ba'}
                      stroke={entry.status !== 'done' ? '#b8a890' : undefined}
                      strokeWidth={entry.status !== 'done' ? 1.5 : 0}
                      strokeDasharray={entry.status === 'todo' ? '4 2' : undefined}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2">
              {statusData.map(({ name, color, value }) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sand-600">{name} ({value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sprintData.map(({ sprint, points, tickets, status, number, theme }) => (
              <div
                key={sprint}
                className="flex items-center justify-between py-2 border-b border-sand last:border-0 cursor-pointer hover:bg-sand-100 rounded-lg px-2 -mx-2 transition-colors"
                onClick={() => navigate(`/sprint/${number}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-charcoal font-medium">{sprint}</span>
                  <Badge variant={statusToBadgeVariant(status)}>
                    {statusLabel(status)}
                  </Badge>
                  <span className="text-xs text-sage-700 font-medium">{theme}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-sand-600">
                    {tickets} tickets · {points} pts
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" className="text-sage">
                    <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
