import React, { useState } from 'react'

export interface AgentData {
  id: string
  name: string
  color: string
  values: Record<string, number>
}

interface AgentCapabilityRadarProps {
  agents: AgentData[]
  axes: { key: string; label: string }[]
  title?: string
  size?: number
}

export const AgentCapabilityRadar: React.FC<AgentCapabilityRadarProps> = ({
  agents, axes, title, size = 300,
}) => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set(agents.map(a => a.id)))

  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 40
  const angleStep = (2 * Math.PI) / axes.length

  const getPoint = (axisIdx: number, value: number) => {
    const angle = axisIdx * angleStep - Math.PI / 2
    const r = (value / 100) * maxR
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  const getPolygonPoints = (agent: AgentData) => {
    return axes.map((axis, i) => {
      const val = agent.values[axis.key] || 0
      const pt = getPoint(i, val)
      return `${pt.x},${pt.y}`
    }).join(' ')
  }

  const toggleAgent = (id: string) => {
    const next = new Set(selectedAgents)
    if (next.has(id)) {
      if (next.size > 1) next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedAgents(next)
  }

  return (
    <div>
      {title && <div className="text-sm font-medium text-terracotta mb-3">{title}</div>}
      <div className="bg-cream border border-sand rounded-xl p-4">
        <div className="flex gap-6">
          <svg width={size} height={size} className="flex-shrink-0">
            {[20, 40, 60, 80, 100].map(pct => (
              <circle key={pct} cx={cx} cy={cy} r={(pct / 100) * maxR} fill="none" stroke="#e8e4d8" strokeWidth={1} />
            ))}
            {[20, 40, 60, 80, 100].map(pct => (
              <text key={pct} x={cx + 4} y={cy - (pct / 100) * maxR + 3} fontSize={7} fill="#b8a890" fontFamily="'JetBrains Mono', monospace">
                {pct}
              </text>
            ))}
            {axes.map((axis, i) => {
              const end = getPoint(i, 100)
              const labelPt = getPoint(i, 115)
              return (
                <g key={axis.key}>
                  <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#d8d0ba" strokeWidth={1} />
                  <text x={labelPt.x} y={labelPt.y} textAnchor="middle" fontSize={9} fontWeight={500}
                    fill="#574b3b" fontFamily="Inter, sans-serif">
                    {axis.label}
                  </text>
                </g>
              )
            })}
            {agents.filter(a => selectedAgents.has(a.id)).map(agent => {
              const isHovered = hoveredAgent === agent.id
              return (
                <g key={agent.id}>
                  <polygon points={getPolygonPoints(agent)} fill={agent.color}
                    fillOpacity={isHovered ? 0.35 : 0.15} stroke={agent.color}
                    strokeWidth={isHovered ? 2.5 : 1.5} style={{ transition: 'all 0.2s ease' }} />
                  {axes.map((axis, i) => {
                    const val = agent.values[axis.key] || 0
                    const pt = getPoint(i, val)
                    return (
                      <circle key={axis.key} cx={pt.x} cy={pt.y} r={isHovered ? 4 : 3}
                        fill={agent.color} stroke="#faf9f5" strokeWidth={1.5} />
                    )
                  })}
                </g>
              )
            })}
          </svg>
          <div className="flex flex-col gap-2 justify-center">
            {agents.map(agent => {
              const active = selectedAgents.has(agent.id)
              const isHovered = hoveredAgent === agent.id
              return (
                <button key={agent.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                    active ? isHovered ? 'bg-sand-200 shadow-subtle' : 'bg-cream' : 'bg-parchment opacity-50'
                  } border ${active ? 'border-sand' : 'border-transparent'}`}
                  onClick={() => toggleAgent(agent.id)}
                  onMouseEnter={() => setHoveredAgent(agent.id)}
                  onMouseLeave={() => setHoveredAgent(null)}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: agent.color }} />
                  <span className="text-charcoal font-medium">{agent.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
