import React, { useState } from 'react'

export interface TimelinePhase {
  id: string
  label: string
  startCol: number
  span: number
  row: number
  color?: string
  status?: 'done' | 'active' | 'planned'
  tickets?: string[]
}

export interface TimelineMilestone {
  col: number
  label: string
  icon?: string
}

interface SprintTimelineProps {
  phases: TimelinePhase[]
  milestones?: TimelineMilestone[]
  columns: string[]
  title?: string
  totalRows?: number
}

const statusFills: Record<string, { bg: string; border: string; text: string }> = {
  done: { bg: '#698472', border: '#4a6b54', text: '#faf9f5' },
  active: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  planned: { bg: '#faf9f5', border: '#d8d0ba', text: '#574b3b' },
}

export const SprintTimeline: React.FC<SprintTimelineProps> = ({
  phases, milestones = [], columns, title, totalRows = 3,
}) => {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null)

  const colWidth = 120
  const rowHeight = 52
  const headerHeight = 36
  const leftPad = 20
  const svgW = columns.length * colWidth + leftPad + 20
  const svgH = headerHeight + totalRows * rowHeight + 60

  return (
    <div>
      {title && <div className="text-sm font-medium text-terracotta mb-3">{title}</div>}
      <div className="bg-cream border border-sand rounded-xl overflow-x-auto p-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: Math.min(svgH, 300) }}>
          {columns.map((col, i) => (
            <g key={col}>
              <rect x={leftPad + i * colWidth} y={0} width={colWidth} height={headerHeight}
                fill={i % 2 === 0 ? '#f5f3ed' : '#faf9f5'} rx={0} />
              <text x={leftPad + i * colWidth + colWidth / 2} y={headerHeight / 2 + 4}
                textAnchor="middle" fontSize={10} fontWeight={600} fill="#574b3b"
                fontFamily="'JetBrains Mono', monospace">
                {col}
              </text>
              <line x1={leftPad + i * colWidth} y1={headerHeight} x2={leftPad + i * colWidth} y2={svgH - 20}
                stroke="#e8e4d8" strokeWidth={0.5} />
            </g>
          ))}

          {Array.from({ length: totalRows }).map((_, r) => (
            <line key={r} x1={leftPad} y1={headerHeight + r * rowHeight} x2={svgW - 20} y2={headerHeight + r * rowHeight}
              stroke="#e8e4d8" strokeWidth={0.5} strokeDasharray="4 4" />
          ))}

          {phases.map(phase => {
            const style = statusFills[phase.status || 'planned']
            const isHovered = hoveredPhase === phase.id
            const x = leftPad + phase.startCol * colWidth + 4
            const y = headerHeight + phase.row * rowHeight + 8
            const w = phase.span * colWidth - 8
            const h = rowHeight - 16

            return (
              <g key={phase.id} onMouseEnter={() => setHoveredPhase(phase.id)} onMouseLeave={() => setHoveredPhase(null)} style={{ cursor: 'pointer' }}>
                <rect x={x} y={y} width={w} height={h} rx={8}
                  fill={phase.color || style.bg}
                  stroke={isHovered ? '#8e6a59' : style.border}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ transition: 'all 0.15s ease' }} />
                {phase.status === 'active' && (
                  <rect x={x} y={y} width={w * 0.6} height={h} rx={8} fill="#698472" opacity={0.15} />
                )}
                <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle"
                  fontSize={10} fontWeight={isHovered ? 600 : 500}
                  fill={phase.color ? '#faf9f5' : style.text} fontFamily="Inter, sans-serif">
                  {phase.label}
                </text>
                {phase.tickets && phase.tickets.length > 0 && (
                  <g>
                    <circle cx={x + w - 12} cy={y + 10} r={8} fill="#8e6a59" />
                    <text x={x + w - 12} y={y + 14} textAnchor="middle" fontSize={8} fontWeight={700} fill="#faf9f5">
                      {phase.tickets.length}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {milestones.map((ms, i) => {
            const x = leftPad + ms.col * colWidth + colWidth / 2
            const y = svgH - 18
            return (
              <g key={i}>
                <line x1={x} y1={headerHeight} x2={x} y2={svgH - 30} stroke="#8e6a59" strokeWidth={1.5} strokeDasharray="3 3" />
                <polygon points={`${x - 6},${y} ${x + 6},${y} ${x},${y - 10}`} fill="#8e6a59" />
                <text x={x} y={y + 12} textAnchor="middle" fontSize={8} fill="#8e6a59" fontWeight={500}>
                  {ms.icon || ''} {ms.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
