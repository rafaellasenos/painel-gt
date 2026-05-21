'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import type { CompanyGroup } from '@/app/api/admin/companies/route'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function gtColor(gt: string) {
  if (gt.includes('Gestão')) return { bg: 'rgba(29,214,246,0.08)', color: '#1DD6F6' }
  if (gt.includes('Pessoas')) return { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' }
  if (gt.includes('Marketing')) return { bg: 'rgba(251,146,60,0.1)', color: '#fb923c' }
  if (gt.includes('IA')) return { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' }
  return { bg: 'rgba(255,255,255,0.05)', color: '#8a90a0' }
}

function CompanyAccordion({ group }: { group: CompanyGroup }) {
  const [open, setOpen] = useState(false)
  const initial = group.company.charAt(0).toUpperCase()

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: '#0d0d1f', border: 'none', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#111127' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#0d0d1f' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: 'rgba(29,214,246,0.1)', border: '1px solid rgba(29,214,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#1DD6F6',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {initial}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              {group.company}
            </p>
            <p style={{ fontSize: '11px', color: '#555b6e', fontFamily: "'DM Sans', sans-serif", margin: '2px 0 0' }}>
              {group.total} {group.total === 1 ? 'colaborador' : 'colaboradores'}
            </p>
          </div>
        </div>
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555b6e" strokeWidth="2.5"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#080818' }}>
          {group.collaborators.map((c, i) => {
            const { bg, color } = gtColor(c.meeting_title)
            return (
              <div
                key={c.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderBottom: i < group.collaborators.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1DD6F6', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#d0d4e0', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#555b6e', fontFamily: "'DM Sans', sans-serif", margin: '2px 0 0' }}>
                      {c.email}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  {c.meeting_title && (
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                      background: bg, color, fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {c.meeting_title.replace('GT - ', '')}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#3a3f50', fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDate(c.created_at)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CompaniesPage() {
  const [groups, setGroups] = useState<CompanyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/companies')
      .then(r => r.json())
      .then(data => { setGroups(data); setLoading(false) })
  }, [])

  const filtered = groups.filter(g =>
    g.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div style={{ padding: '32px 36px', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f2f5', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Por Empresa
          </h1>
          <p style={{ fontSize: '13px', color: '#555b6e', marginTop: '4px' }}>
            Empresas com colaboradores registrados
          </p>
        </div>

        {/* Busca + contagem */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555b6e" strokeWidth="2"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '9px 14px 9px 34px',
                fontSize: '13px', color: '#f0f2f5', outline: 'none', width: '240px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>
          {!loading && (
            <span style={{ fontSize: '12px', color: '#3a3f50' }}>
              {filtered.length} {filtered.length === 1 ? 'empresa' : 'empresas'}
            </span>
          )}
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px' }}>
            <p style={{ fontSize: '13px', color: '#3a3f50' }}>Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', background: '#0d0d1f' }}>
            <p style={{ fontSize: '13px', color: '#3a3f50' }}>Nenhuma empresa encontrada</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(group => (
              <CompanyAccordion key={group.company} group={group} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
