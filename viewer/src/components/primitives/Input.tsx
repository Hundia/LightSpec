import React from 'react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, size = 'md', fullWidth = true, startAdornment, endAdornment, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    const inputClasses = [
      'block font-sans bg-parchment border rounded-lg',
      'transition-all duration-200 placeholder:text-sand-500',
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      startAdornment ? 'pl-10' : '',
      endAdornment ? 'pr-10' : '',
      hasError
        ? 'border-terracotta focus:border-terracotta focus:ring-2 focus:ring-terracotta/15'
        : 'border-sand focus:border-sage focus:ring-2 focus:ring-sage/15',
      'focus:outline-none',
      'disabled:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60',
      className,
    ].filter(Boolean).join(' ')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-terracotta mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-500">{startAdornment}</div>}
          <input ref={ref} id={inputId} className={inputClasses} aria-invalid={hasError} {...props} />
          {endAdornment && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500">{endAdornment}</div>}
        </div>
        {error && <p className="mt-1.5 text-sm text-terracotta" role="alert">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-sand-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
