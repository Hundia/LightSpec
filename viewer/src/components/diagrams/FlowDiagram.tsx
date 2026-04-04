import React, { useState } from 'react'

export interface FlowStep {
  id: string
  label: string
  description?: string
  type: 'start' | 'process' | 'decision' | 'end' | 'parallel' | 'validation'
  status?: 'active' | 'complete' | 'pending' | 'error'
}

export interface FlowConnection {
  from: string
  to: string
  label?: string
  condition?: 'yes' | 'no' | 'retry' | 'skip'
}

interface FlowDiagramProps {
  steps: FlowStep[]
  connections: FlowConnection[]
  title?: string
  direction?: 'horizontal' | 'vertical'
}

const typeShapes = {
  start: { width: 100, height: 40, radius: 20 },
  process: { width: 160, height: 48, radius: 8 },
  decision: { width: 120, height: 60, radius: 0 },
  end: { width: 100, height: 40, radius: 20 },
  parallel: { width: 160, height: 48, radius: 8 },
  validation: { width: 140, height: 44, radius: 22 },
}

const statusStyles: Record<string, { fill: string; stroke: string; text: string; glow?: string }> = {
  active: { fill: '#698472', stroke: '#4a6b54', text: '#faf9f5', glow: 'rgba(105,132,114,0.3)' },
  complete: { fill: '#dfe8e2', stroke: '#698472', text: '#303b34' },
  pending: { fill: '#faf9f5', stroke: '#d8d0ba', text: '#574b3b' },
  error: { fill: '#fee2e2', stroke: '#ef4444', text: '#991b1b' },
}

const conditionColors: Record<string, string> = {
  yes: '#698472',
  no: '#ef4444',
  retry: '#f59e0b',
  skip: '#94a3b8',
}

function renderShape(step: FlowStep, x: number, y: number, isHovered: boolean) {
  const shape = typeShapes[step.type]
  const style = statusStyles[step.status || 'pending']
  const sw = isHovered ? 2.5 : 1.5

  if (step.type === 'decision') {
    const cx = x + shape.width / 2
    const cy = y + shape.height / 2
    return (
      <polygon
        points={`${cx},${y} ${x + shape.width},${cy} ${cx},${y + shape.height} ${x},${cy}`}
        fill={style.fill}
        stroke={isHovered ? '#8e6a59' : style.stroke}
        strokeWidth={sw}
      />
    )
  }

  if (step.type === 'parallel') {
    return (
      <g>
        <rect x={x} y={y} width={shape.width} height={shape.height}
          rx={shape.radius} fill={style.fill}
          stroke={isHovered ? '#8e6a59' : style.stroke} strokeWidth={sw} />
        <line x1={x + 8} y1={y} x2={x + 8} y2={y + shape.height} stroke={style.stroke} strokeWidth={1} />
        <line x1={x + shape.width - 8} y1={y} x2={x + shape.width - 8} y2={y + shape.height} stroke={style.stroke} strokeWidth={1} />
      </g>
    )
  }

  return (
    <rect x={x} y={y} width={shape.width} height={shape.height}
      rx={shape.radius} fill={style.fill}
      stroke={isHovered ? '#8e6a59' : style.stroke} strokeWidth={sw} />
  )
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  steps, connections, title, direction = 'vertical',
}) => {
  const [hovered, setHovered] = useState<string | null>(null)

  const isVert = direction === 'vertical'
  const colWidth = 200
  const rowHeight = 90

  const positions = new Map<string, { x: number; y: number }>()
  steps.forEach((step, i) => {
    if (isVert) {
      const col = i % 3
      const row = Math.floor(i / 3)
      positions.set(step.id, { x: col * colWidth + 40, y: row * rowHeight + 40 })
    } else {
      positions.set(step.id, { x: i * (colWidth + 20) + 20, y: 60 })
    }
  })

  const svgW = isVert ? Math.min(3, steps.length) * colWidth + 80 : steps.length * (colWidth + 20) + 40
  const svgH = isVert ? (Math.ceil(steps.length / 3)) * rowHeight + 60 : 200

  return (
    <div>
      {title && <div className="text-sm font-medium text-terracotta mb-3">{title}</div>}
      <div className="bg-cream border border-sand rounded-xl overflow-x-auto p-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: svgH }}>
          <defs>
            <marker id="flow-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#b8a890" />
            </marker>
            <marker id="flow-arrow-cond" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#698472" />
            </marker>
          </defs>

          {connections.map((conn, i) => {
            const fromPos = positions.get(conn.from)
            const toPos = positions.get(conn.to)
            const fromStep = steps.find(s => s.id === conn.from)
            const toStep = steps.find(s => s.id === conn.to)
            if (!fromPos || !toPos || !fromStep || !toStep) return null

            const fromShape = typeShapes[fromStep.type]
            const toShape = typeShapes[toStep.type]
            const sx = fromPos.x + fromShape.width / 2
            const sy = fromPos.y + fromShape.height
            const ex = toPos.x + toShape.width / 2
            const ey = toPos.y
            const my = (sy + ey) / 2
            const color = conn.condition ? conditionColors[conn.condition] || '#b8a890' : '#b8a890'

            return (
              <g key={i}>
                <path d={`M ${sx} ${sy} C ${sx} ${my}, ${ex} ${my}, ${ex} ${ey}`}
                  fill="none" stroke={color} strokeWidth={1.5}
                  markerEnd={conn.condition ? 'url(#flow-arrow-cond)' : 'url(#flow-arrow)'} />
                {conn.label && (
                  <text x={(sx + ex) / 2 + 5} y={(sy + ey) / 2 - 4} fontSize={8} fill={color}
                    fontWeight={500} fontFamily="Inter, sans-serif">
                    {conn.label}
                  </text>
                )}
              </g>
            )
          })}

          {steps.map(step => {
            const pos = positions.get(step.id)
            if (!pos) return null
            const shape = typeShapes[step.type]
            const style = statusStyles[step.status || 'pending']
            const isH = hovered === step.id

            return (
              <g key={step.id} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(step.id)}
                onMouseLeave={() => setHovered(null)}>
                {isH && style.glow && (
                  <rect x={pos.x - 4} y={pos.y - 4}
                    width={shape.width + 8} height={shape.height + 8}
                    rx={(shape.radius || 0) + 4} fill={style.glow} stroke="none" />
                )}
                {renderShape(step, pos.x, pos.y, isH)}
                {step.type === 'validation' && (
                  <text x={pos.x + 12} y={pos.y + shape.height / 2 + 4} fontSize={14}>
                    &#x2713;
                  </text>
                )}
                <text x={pos.x + shape.width / 2} y={pos.y + shape.height / 2 + 4}
                  textAnchor="middle" fontSize={10} fontWeight={500} fill={style.text} fontFamily="Inter, sans-serif">
                  {step.label.length > 20 ? step.label.slice(0, 19) + '...' : step.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
