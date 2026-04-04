import React from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value, max, size = 80, strokeWidth = 6, color = '#698472', label,
}) => {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const progress = max > 0 ? (value / max) * circumference : 0
  const dashoffset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth} stroke="#e8e4d8" fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth} stroke={color} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {label && <div className="text-xs text-sand-600 text-center">{label}</div>}
    </div>
  )
}
