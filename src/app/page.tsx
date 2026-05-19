'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

interface FormData {
  name: string
  role: string
  company: string
}

interface FormErrors {
  name?: string
  role?: string
  company?: string
}

export default function RegisterPage() {
  const [meetingTitle, setMeetingTitle] = useState('Reunião Online')
  const [form, setForm] = useState<FormData>({ name: '', role: '', company: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'meeting_title')
      .single()
      .then(({ data }) => {
        if (data?.value) setMeetingTitle(data.value)
      })
  }, [])

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    if (!form.role.trim() || form.role.trim().length < 2) newErrors.role = 'Preencha seu cargo ou função'
    if (!form.company.trim() || form.company.trim().length < 2) newErrors.company = 'Nome da empresa deve ter pelo menos 2 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.role, company: form.company }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? 'Erro ao processar. Tente novamente.')
        return
      }

      setSuccess(true)
      setTimeout(() => { window.location.href = data.meetLink }, 1500)
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#00000F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(29,214,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(29,214,246,0.03) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)',
      }} />

      {/* Orbs */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,177,9,0.1), transparent)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,214,246,0.08), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {!showForm && !success && (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease both' }}>

            {/* Badge GT */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 20px', borderRadius: '100px', background: 'rgba(29,214,246,0.08)', border: '1px solid rgba(29,214,246,0.2)', marginBottom: '28px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1DD6F6" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1DD6F6', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grupo de Trabalho</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 56px)',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              color: '#f0f2f5',
              marginBottom: '20px',
            }}>
              Pronto para o{' '}
              <span style={{
                background: 'linear-gradient(135deg, #38B109, #1DD6F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                GT de hoje?
              </span>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: '18px',
              color: '#8a90a0',
              lineHeight: 1.7,
              marginBottom: '40px',
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: '460px',
              margin: '0 auto 40px',
            }}>
              Vamos construir juntos mais um capítulo da nossa jornada rumo ao crescimento.
            </p>

            {/* CTA */}
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '18px 48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38B109, #2eaa05)',
                color: '#f0f2f5',
                fontSize: '17px',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.3px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(56,177,9,0.25)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(56,177,9,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(56,177,9,0.25)' }}
            >
              Quero participar!
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>

            {/* Rodapé discreto */}
            <p style={{ fontSize: '12px', color: '#2a2e3d', marginTop: '32px' }}>
              🔒 Seus dados estão protegidos
            </p>
          </div>
        )}

        {showForm && !success && (
          <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeInUp 0.4s ease both' }}>

            {/* Voltar */}
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555b6e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontFamily: "'DM Sans', sans-serif", padding: 0 }}
            >
              ← Voltar
            </button>

            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px', color: '#f0f2f5', marginBottom: '6px' }}>
                Quase lá!
              </h2>
              <p style={{ fontSize: '14px', color: '#8a90a0' }}>Preencha seus dados para entrar na reunião.</p>
            </div>

            <div style={{ background: '#0d0d20', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '32px 28px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Input
                  id="name"
                  label="Nome completo"
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                  autoComplete="name"
                />

                <Input
                  id="role"
                  label="Eu sou..."
                  type="text"
                  placeholder="Ex: CEO, Colaborador, Gestor..."
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  error={errors.role}
                />

                <Input
                  id="company"
                  label="Nome da empresa"
                  type="text"
                  placeholder="Sua empresa"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  error={errors.company}
                  autoComplete="organization"
                />

                {serverError && (
                  <div style={{ borderRadius: '10px', background: 'rgba(227,28,44,0.08)', border: '1px solid rgba(227,28,44,0.2)', padding: '12px 16px', fontSize: '13px', color: '#ff4d5a' }}>
                    {serverError}
                  </div>
                )}

                <Button type="submit" loading={loading} style={{ padding: '16px', fontSize: '15px', marginTop: '4px' }}>
                  {loading ? 'Aguarde...' : 'Entrar na Reunião →'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {success && (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(56,177,9,0.12)', border: '1px solid rgba(56,177,9,0.3)', marginBottom: '20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38B109" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '26px', letterSpacing: '-0.5px', color: '#f0f2f5', marginBottom: '8px' }}>Tudo certo!</h2>
            <p style={{ fontSize: '15px', color: '#8a90a0' }}>Redirecionando para a reunião...</p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
