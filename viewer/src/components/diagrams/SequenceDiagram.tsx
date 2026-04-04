import React, { useState } from 'react'

export interface Actor {
  id: string
  label: string
  color?: string
  icon?: string
}

export interface Message {
  from: string
  to: string
  label: string
  type: 'sync' | 'async' | 'return' | 'self'
  description?: string
}

export interface ActivationBar {
  actor: string
  startMsg: number
  endMsg: number
}

interface SequenceDiagramProps {
  actors: Actor[]
  messages: Message[]
  activations?: ActivationBar[]
  title?: string
}

const defaultColors = ['#698472', '#8e6a59', '#b08a79', '#7a9488', '#a08c72', '#6b8f7e']

export const SequenceDiagram: React.FC<SequenceDiagramProps> = ({
  actors, messages, activations = [], title,
}) => {
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null)

  const actorWidth = 130
  const msgHeight = 50
  const headerHeight = 70
  const footerHeight = 30
  const svgW = actors.length * actorWidth + 40
  const svgH = headerHeight + messages.length * msgHeight + footerHeight + 20

  const getActorX = (actorId: string) => {
    const idx = actors.findIndex(a => a.id === actorId)
    return idx * actorWidth + actorWidth / 2 + 20
  }

  return (
    <div>
      {title && <div className="text-sm font-medium text-terracotta mb-3">{title}</div>}
      <div className="bg-cream border border-sand rounded-xl overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: Math.min(svgH, 500) }}>
          <defs>
            <marker id="seq-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#574b3b" />
            </marker>
            <marker id="seq-arrow-return" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#b8a890" />
            </marker>
            <marker id="seq-arrow-async" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polyline points="0 0, 10 4, 0 8" fill="none" stroke="#698472" strokeWidth="1.5" />
            </marker>
          </defs>

          {actors.map((actor, i) => {
            const x = getActorX(actor.id)
            const color = actor.color || defaultColors[i % defaultColors.length]
            return (
              <g key={actor.id}>
                <line x1={x} y1={headerHeight} x2={x} y2={svgH - footerHeight}
                  stroke="#e8e4d8" strokeWidth={1.5} strokeDasharray="6 4" />
                <rect x={x - 52} y={12} width={104} height={44} rx={10} fill={color} stroke="none" opacity={0.9} />
                {actor.icon && <text x={x - 38} y={40} fontSize={16}>{actor.icon}</text>}
                <text x={actor.icon ? x + 4 : x} y={38} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="#faf9f5" fontFamily="Inter, sans-serif">
                  {actor.label}
                </text>
                <rect x={x - 42} y={svgH - footerHeight} width={84} height={24} rx={6} fill={color} opacity={0.3} />
              </g>
            )
          })}

          {activations.map((bar, i) => {
            const x = getActorX(bar.actor)
            const startY = headerHeight + bar.startMsg * msgHeight + 5
            const endY = headerHeight + (bar.endMsg + 1) * msgHeight - 5
            const actorDef = actors.find(a => a.id === bar.actor)
            const color = actorDef?.color || '#698472'
            return (
              <rect key={i} x={x - 6} y={startY} width={12} height={endY - startY}
                rx={3} fill={color} opacity={0.15} stroke={color} strokeWidth={1} />
            )
          })}

          {messages.map((msg, i) => {
            const y = headerHeight + i * msgHeight + msgHeight / 2
            const fromX = getActorX(msg.from)
            const toX = getActorX(msg.to)
            const isHovered = hoveredMsg === i
            const isSelf = msg.type === 'self' || msg.from === msg.to

            if (isSelf) {
              const loopW = 40
              return (
                <g key={i} onMouseEnter={() => setHoveredMsg(i)} onMouseLeave={() => setHoveredMsg(null)} style={{ cursor: 'default' }}>
                  <path d={`M ${fromX + 6} ${y} H ${fromX + loopW} V ${y + 20} H ${fromX + 6}`}
                    fill="none" stroke={isHovered ? '#8e6a59' : '#574b3b'}
                    strokeWidth={isHovered ? 2 : 1.5} markerEnd="url(#seq-arrow)" />
                  <text x={fromX + loopW + 8} y={y + 4} fontSize={9} fill="#574b3b"
                    fontFamily="Inter, sans-serif" fontWeight={isHovered ? 600 : 400}>
                    {msg.label}
                  </text>
                </g>
              )
            }

            const isReturn = msg.type === 'return'
            const isAsync = msg.type === 'async'
            const leftToRight = toX > fromX
            const startX = fromX + (leftToRight ? 8 : -8)
            const endX = toX + (leftToRight ? -8 : 8)

            return (
              <g key={i} onMouseEnter={() => setHoveredMsg(i)} onMouseLeave={() => setHoveredMsg(null)} style={{ cursor: 'default' }}>
                <line x1={startX} y1={y} x2={endX} y2={y}
                  stroke={isHovered ? '#8e6a59' : isReturn ? '#b8a890' : '#574b3b'}
                  strokeWidth={isHovered ? 2 : 1.5}
                  strokeDasharray={isReturn ? '6 3' : isAsync ? '4 2' : undefined}
                  markerEnd={isReturn ? 'url(#seq-arrow-return)' : isAsync ? 'url(#seq-arrow-async)' : 'url(#seq-arrow)'} />
                <rect x={(startX + endX) / 2 - msg.label.length * 3} y={y - 16}
                  width={msg.label.length * 6 + 12} height={14} rx={4}
                  fill={isHovered ? '#faf9f5' : 'transparent'} stroke={isHovered ? '#e8e4d8' : 'none'} />
                <text x={(startX + endX) / 2} y={y - 6} textAnchor="middle" fontSize={9}
                  fontWeight={isHovered ? 600 : 400} fill={isReturn ? '#b8a890' : '#574b3b'} fontFamily="Inter, sans-serif">
                  {msg.label}
                </text>
                {isHovered && msg.description && (
                  <foreignObject x={Math.min(startX, endX)} y={y + 4} width={Math.abs(endX - startX)} height={30}>
                    <div style={{ fontSize: 8, color: '#a08c72', textAlign: 'center', fontFamily: 'Inter, sans-serif', padding: '2px 4px' }}>
                      {msg.description}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
