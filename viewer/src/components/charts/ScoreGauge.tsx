import React from 'react'

interface ScoreGaugeProps {
  score: number        // 0-100
  label: string        // e.g. "Claude Sonnet"
  size?: number        // default 140
  tierLabel: string    // e.g. "Good"
  tierColor: string    // hex color
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score, label, size = 140, tierLabel, tierColor,
}) => {
  const strokeWidth = 8
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (score / 100) * circumference
  const dashoffset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} stroke="#e8e4d8" fill="none" />
          <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} stroke={tierColor} fill="none"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-light text-charcoal">{score}</span>
          <span className="text-xs text-sand-600">/100</span>
        </div>
      </div>
      <div className="text-sm font-medium text-charcoal">{label}</div>
      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: tierColor + '20', color: tierColor }}>
        {tierLabel}
      </span>
    </div>
  )
}
