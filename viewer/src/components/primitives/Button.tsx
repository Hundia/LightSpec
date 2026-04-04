import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  children: React.ReactNode
}

const variantStyles = {
  primary: 'bg-sage text-cream border-transparent hover:bg-sage-600 active:bg-sage-700 disabled:bg-sage-300 disabled:cursor-not-allowed',
  secondary: 'bg-terracotta text-cream border-transparent hover:bg-terracotta-700 active:bg-terracotta-800 disabled:opacity-50 disabled:cursor-not-allowed',
  outline: 'bg-transparent text-terracotta border-terracotta border-[1.5px] hover:bg-terracotta hover:text-cream disabled:border-sand-400 disabled:text-sand-400 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-sage border-transparent hover:bg-sand-200 active:bg-sand-300 disabled:text-sand-400 disabled:cursor-not-allowed',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, icon, iconPosition = 'end', disabled, className = '', children, ...props }, ref) => {
    const classes = [
      'inline-flex items-center justify-center gap-2',
      'font-sans font-medium tracking-wide',
      'rounded-full border',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-sage/30',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      loading ? 'opacity-70 cursor-wait' : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && iconPosition === 'start' && !loading && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'end' && !loading && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
