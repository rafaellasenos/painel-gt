'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Button } from '@/components/Button'

const GT_OPTIONS = [
  'GT - Gestão e Estratégia',
  'GT - Pessoas e Processos',
  'GT - Marketing e Vendas',
  'GT - IA e Inovação',
]

export default function SettingsPage() {
  const [meetLink, setMeetLink] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setMeetLink(data.meet_link ?? '')
        setMeetingTitle(data.meeting_title ?? '')
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    if (!meetingTitle) {
      setErrors({ meeting_title: 'Selecione um GT' })
      return
    }
    if (meetLink && !meetLink.startsWith('https://meet.google.com/')) {
      setErrors({ meet_link: 'O link deve começar com https://meet.google.com/' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meet_link: meetLink, meeting_title: meetingTitle }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        window.open(window.location.origin, '_blank')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div style={{ padding: '40px', maxWidth: '480px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#f0f2f5', marginBottom: '28px' }}>Configurações</h1>

        <div style={{ background: '#0d0d20', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '32px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Dropdown GT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#8a90a0', letterSpacing: '0.5px' }}>
                Grupo de Trabalho
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 40px 14px 18px',
                    borderRadius: '10px',
                    border: errors.meeting_title ? '1px solid rgba(227,28,44,0.5)' : '1px solid #2a2e3d',
                    background: '#080818',
                    color: meetingTitle ? '#f0f2f5' : '#555b6e',
                    fontSize: '15px',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={e => { if (!errors.meeting_title) e.currentTarget.style.borderColor = '#1DD6F6' }}
                  onBlur={e => { if (!errors.meeting_title) e.currentTarget.style.borderColor = '#2a2e3d' }}
                >
                  <option value="" disabled>Selecione o GT...</option>
                  {GT_OPTIONS.map(gt => (
                    <option key={gt} value={gt} style={{ background: '#080818', color: '#f0f2f5' }}>{gt}</option>
                  ))}
                </select>
                {/* Chevron */}
                <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#555b6e' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.meeting_title && <p style={{ fontSize: '12px', color: '#ff4d5a' }}>{errors.meeting_title}</p>}
            </div>

            {/* Link do Meet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#8a90a0', letterSpacing: '0.5px' }}>
                Link do Google Meet
              </label>
              <input
                id="meet_link"
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetLink}
                onChange={e => setMeetLink(e.target.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: errors.meet_link ? '1px solid rgba(227,28,44,0.5)' : '1px solid #2a2e3d',
                  background: '#080818',
                  color: '#f0f2f5',
                  fontSize: '15px',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => { if (!errors.meet_link) e.currentTarget.style.borderColor = '#1DD6F6' }}
                onBlur={e => { if (!errors.meet_link) e.currentTarget.style.borderColor = '#2a2e3d' }}
              />
              {errors.meet_link && <p style={{ fontSize: '12px', color: '#ff4d5a' }}>{errors.meet_link}</p>}
              {meetLink && meetLink.startsWith('https://meet.google.com/') && (
                <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1DD6F6', textDecoration: 'none' }}>
                  ↗ Testar link
                </a>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '4px' }}>
              <Button type="submit" loading={loading}>
                Salvar Configurações
              </Button>
              {saved && (
                <span style={{ fontSize: '13px', color: '#38B109', fontWeight: 600 }}>✓ Salvo com sucesso!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
