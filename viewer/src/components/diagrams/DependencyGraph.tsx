import React, { useState } from 'react'

export interface GraphNode {
  id: string
  label: string
  description?: string
  status?: 'todo' | 'in-progress' | 'done' | 'blocked'
  x: number
  y: number
  owner?: string
  points?: number
}

export interface GraphEdge {
  from: string
  to: string
}

interface DependencyGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width?: number
  height?: number
  title?: string
}

const statusColors: Record<string, { fill: string; stroke: string; text: string }> = {
  todo: { fill: '#e8e4d8', stroke: '#d8d0ba', text: '#574b3b' },
  'in-progress': { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e' },
  done: { fill: '#698472', stroke: '#4a6b54', text: '#faf9f5' },
  blocked: { fill: '#fee2e2', stroke: '#ef4444', text: '#991b1b' },
}

function getNodeCenter(node: GraphNode): { cx: number; cy: number } {
  return { cx: node.x + 70, cy: node.y + 24 }
}

function computeEdgePath(from: GraphNode, to: GraphNode): string {
  const start = getNodeCenter(from)
  const end = getNodeCenter(to)

  const dx = end.cx - start.cx
  const dy = end.cy - start.cy
  const dist = Math.sqrt(dx * dx + dy * dy)

  const nodeW = 70
  const nodeH = 24
  const ox = (dx / (dist || 1)) * nodeW * 0.65
  const oy = (dy / (dist || 1)) * nodeH * 0.8

  const sx = start.cx + ox
  const sy = start.cy + oy
  const ex = end.cx - ox
  const ey = end.cy - oy

  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2 - Math.abs(dx) * 0.12

  return `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  nodes, edges, width = 780, height = 340, title,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const connectedEdges = (nodeId: string) =>
    edges.filter(e => e.from === nodeId || e.to === nodeId)

  const isEdgeHighlighted = (edge: GraphEdge) =>
    hoveredNode ? edge.from === hoveredNode || edge.to === hoveredNode : false

  const selectedData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="relative">
      {title && (
        <div className="text-sm font-medium text-terracotta mb-3">{title}</div>
      )}
      <div className="bg-cream border border-sand rounded-xl overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ maxHeight: height }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#b8a890" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#698472" />
            </marker>
            <filter id="node-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" floodColor="#8e6a59" />
            </filter>
          </defs>

          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null
            const highlighted = isEdgeHighlighted(edge)
            return (
              <path
                key={i}
                d={computeEdgePath(fromNode, toNode)}
                fill="none"
                stroke={highlighted ? '#698472' : '#d8d0ba'}
                strokeWidth={highlighted ? 2.5 : 1.5}
                strokeDasharray={highlighted ? undefined : '6 3'}
                markerEnd={highlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                style={{ transition: 'all 0.2s ease' }}
              />
            )
          })}

          {nodes.map(node => {
            const colors = statusColors[node.status || 'todo']
            const isHovered = hoveredNode === node.id
            const isSelected = selectedNode === node.id
            const isConnected = hoveredNode
              ? connectedEdges(hoveredNode).some(e => e.from === node.id || e.to === node.id)
              : false
            const opacity = hoveredNode && !isHovered && !isConnected ? 0.4 : 1

            return (
              <g
                key={node.id}
                style={{ transition: 'opacity 0.2s ease', opacity, cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                <rect
                  x={node.x} y={node.y} width={140} height={48} rx={12}
                  fill={colors.fill}
                  stroke={isSelected ? '#8e6a59' : isHovered ? '#698472' : colors.stroke}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.5}
                  filter="url(#node-shadow)"
                  style={{ transition: 'all 0.15s ease' }}
                />
                <text x={node.x + 70} y={node.y + 19} textAnchor="middle" fontSize={10} fontWeight={600}
                  fontFamily="'JetBrains Mono', monospace" fill={colors.text}>
                  {node.id}
                </text>
                <text x={node.x + 70} y={node.y + 34} textAnchor="middle" fontSize={9}
                  fill={colors.text} opacity={0.8} fontFamily="Inter, sans-serif">
                  {node.label.length > 18 ? node.label.slice(0, 17) + '...' : node.label}
                </text>
                {node.points && (
                  <g>
                    <circle cx={node.x + 128} cy={node.y + 8} r={10} fill="#8e6a59" />
                    <text x={node.x + 128} y={node.y + 12} textAnchor="middle" fontSize={8} fontWeight={700} fill="#faf9f5">
                      {node.points}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        {selectedData && (
          <div className="border-t border-sand p-4 bg-parchment">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-charcoal">{selectedData.id}</span>
                  <span className="text-sm text-charcoal">{selectedData.label}</span>
                </div>
                {selectedData.description && (
                  <p className="text-xs text-sand-600 mt-1 max-w-lg">{selectedData.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs">
                {selectedData.owner && (
                  <span className="px-2 py-0.5 bg-sand-200 rounded-full text-sand-700">{selectedData.owner}</span>
                )}
                {selectedData.points && (
                  <span className="px-2 py-0.5 bg-terracotta text-cream rounded-full font-medium">{selectedData.points} pts</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {connectedEdges(selectedData.id)
                .filter(e => e.to === selectedData.id)
                .map(e => (
                  <span key={e.from} className="text-xs px-2 py-0.5 bg-sage/10 text-sage-700 rounded-full">
                    needs {e.from}
                  </span>
                ))
              }
              {connectedEdges(selectedData.id)
                .filter(e => e.from === selectedData.id)
                .map(e => (
                  <span key={e.to} className="text-xs px-2 py-0.5 bg-terracotta/10 text-terracotta-700 rounded-full">
                    unlocks {e.to}
                  </span>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
