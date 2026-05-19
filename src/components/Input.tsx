interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#8a90a0', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          padding: '14px 18px',
          borderRadius: '10px',
          border: error ? '1px solid rgba(227,28,44,0.5)' : '1px solid #2a2e3d',
          background: '#0d0d20',
          color: '#f0f2f5',
          fontSize: '15px',
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#1DD6F6' }}
        onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#2a2e3d' }}
        {...props}
      />
      {error && (
        <p style={{ fontSize: '12px', color: '#ff4d5a', marginTop: '2px' }}>{error}</p>
      )}
    </div>
  )
}
