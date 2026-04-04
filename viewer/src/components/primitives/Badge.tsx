import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'done'
  | 'in-progress'
  | 'todo'
  | 'blocked'
  | 'qa'
  | 'haiku'
  | 'sonnet'
  | 'opus'
  | 'confirmed'
  | 'cancelled'
  | 'pass'
  | 'fail'
  | 'graded'
  | 'skipped'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-sand-200 text-terracotta',
  done: 'bg-sage text-cream',
  'in-progress': 'bg-amber-100 text-amber-800',
  todo: 'bg-sand-200 text-sand-700',
  blocked: 'bg-red-100 text-red-700',
  qa: 'bg-blue-100 text-blue-700',
  haiku: 'bg-purple-100 text-purple-700',
  sonnet: 'bg-blue-100 text-blue-800',
  opus: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-sage text-cream',
  cancelled: 'bg-terracotta text-cream',
  pass: 'bg-sage text-cream',
  fail: 'bg-terracotta text-cream',
  graded: 'bg-amber-100 text-amber-800',
  skipped: 'bg-sand-200 text-sand-700',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default', size = 'md', children, className = '',
}) => {
  const classes = [
    'inline-flex items-center justify-center font-medium rounded-full',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].filter(Boolean).join(' ')

  return <span className={classes}>{children}</span>
}

export default Badge
