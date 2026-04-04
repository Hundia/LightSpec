import React, { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value, label, prefix = '', suffix = '', duration = 1000,
}) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const steps = 30
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-charcoal">
        {prefix}{current}{suffix}
      </div>
      <div className="text-xs text-sand-600 mt-1">{label}</div>
    </div>
  )
}
