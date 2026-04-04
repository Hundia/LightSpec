import React from 'react'

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

const variantStyles = {
  default: 'bg-cream shadow-subtle',
  elevated: 'bg-cream shadow-soft',
  outlined: 'bg-cream border border-sand',
  filled: 'bg-sand-200',
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card: React.FC<CardProps> = ({
  variant = 'default', padding = 'md', hoverable = false, clickable = false,
  onClick, children, className = '', 'data-testid': dataTestId,
}) => {
  const classes = [
    'rounded-xl transition-all duration-200',
    variantStyles[variant],
    paddingStyles[padding],
    hoverable || clickable ? 'hover:shadow-soft hover:-translate-y-1' : '',
    clickable ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ')

  if (clickable) {
    return (
      <button className={classes} onClick={onClick} type="button" data-testid={dataTestId}>
        {children}
      </button>
    )
  }

  return <div className={classes} data-testid={dataTestId}>{children}</div>
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-normal text-terracotta ${className}`}>{children}</h3>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-sand-600 mt-1 ${className}`}>{children}</p>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-sand ${className}`}>{children}</div>
)

export default Card
