interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#0d0d20',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {children}
    </div>
  )
}
