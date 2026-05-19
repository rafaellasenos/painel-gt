'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('E-mail ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#00000F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,214,246,0.08), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,177,9,0.08), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#1DD6F6', marginBottom: '8px' }}>Meet Gate</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '26px', letterSpacing: '-0.5px', color: '#f0f2f5' }}>Painel Admin</h1>
          <p style={{ fontSize: '14px', color: '#555b6e', marginTop: '6px' }}>EXPX</p>
        </div>

        <div style={{ background: '#0d0d20', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '32px 28px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <div style={{ borderRadius: '10px', background: 'rgba(227,28,44,0.08)', border: '1px solid rgba(227,28,44,0.2)', padding: '12px 16px', fontSize: '13px', color: '#ff4d5a' }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" style={{ padding: '14px', marginTop: '4px' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
