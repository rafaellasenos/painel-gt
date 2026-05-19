interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', loading, children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary: 'text-[#f0f2f5] shadow-[0_4px_20px_rgba(56,177,9,0.15)] hover:shadow-[0_12px_40px_rgba(56,177,9,0.3)] hover:-translate-y-0.5',
    secondary: 'bg-transparent text-[#c8ccd4] border border-[#2a2e3d] hover:border-[#1DD6F6] hover:text-[#1DD6F6]',
    ghost: 'text-[#8a90a0] hover:text-[#f0f2f5] hover:bg-white/5',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={variant === 'primary' ? { background: 'linear-gradient(135deg, #38B109, #2eaa05)' } : undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
