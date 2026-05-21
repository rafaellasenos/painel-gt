'use client'

import { useEffect, useState, useCallback } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import type { CompanyGroup } from '@/app/api/admin/companies/route'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function gtColor(gt: string) {
  if (gt.includes('Gestão')) return { bg: 'rgba(29,214,246,0.08)', color: '#1DD6F6' }
  if (gt.includes('Pessoas')) return { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' }
  if (gt.includes('Marketing')) return { bg: 'rgba(251,146,60,0.1)', color: '#fb923c' }
  if (gt.includes('IA')) return { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' }
  return { bg: 'rgba(255,255,255,0.05)', color: '#8a90a0' }
}

const inputStyle: React.CSSProperties = {
  background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px', padding: '9px 12px',
  fontSize: '13px', color: '#f0f2f5', outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
}

function generatePrintHTML(groups: CompanyGroup[], dateFrom: string, dateTo: string, title: string) {
  const periodLabel = dateFrom || dateTo
    ? `Período: ${dateFrom ? formatDateShort(dateFrom + 'T00:00:00') : 'início'} até ${dateTo ? formatDateShort(dateTo + 'T23:59:59') : 'hoje'}`
    : 'Todos os períodos'

  const rows = groups.map(g => `
    <div class="company">
      <div class="company-header">
        <span class="company-initial">${g.company.charAt(0).toUpperCase()}</span>
        <div>
          <div class="company-name">${g.company}</div>
          <div class="company-count">${g.total} ${g.total === 1 ? 'colaborador' : 'colaboradores'}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Nome</th><th>E-mail</th><th>Registro</th></tr>
        </thead>
        <tbody>
          ${g.collaborators.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.email}</td>
              <td>${formatDate(c.created_at)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 32px; font-size: 13px; }
    .report-header { border-bottom: 2px solid #1DD6F6; padding-bottom: 16px; margin-bottom: 24px; }
    .report-title { font-size: 20px; font-weight: 700; color: #0d0d1f; }
    .report-subtitle { font-size: 12px; color: #555b6e; margin-top: 4px; }
    .report-period { font-size: 12px; color: #555b6e; margin-top: 2px; }
    .company { margin-bottom: 24px; page-break-inside: avoid; }
    .company-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .company-initial { width: 32px; height: 32px; border-radius: 8px; background: #e0fafd; color: #0891b2; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .company-name { font-size: 14px; font-weight: 700; color: #0d0d1f; }
    .company-count { font-size: 11px; color: #8a90a0; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f4f6fa; text-align: left; padding: 7px 10px; font-size: 11px; font-weight: 600; color: #555b6e; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid #f0f0f0; color: #2d2d3a; }
    tr:last-child td { border-bottom: none; }
    .generated { margin-top: 32px; font-size: 11px; color: #aaa; text-align: right; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="report-header">
    <div class="report-title">${title}</div>
    <div class="report-subtitle">Painel GT — Controle de Engajamento</div>
    <div class="report-period">${periodLabel}</div>
  </div>
  ${rows}
  <div class="generated">Gerado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</div>
</body>
</html>`
}

function printReport(html: string) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print() }, 400)
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
  // inputs controlados pelo usuário (não disparam fetch ao mudar)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  // datas aplicadas (disparam fetch)
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  const fetchGroups = useCallback((from: string, to: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (from) params.set('dateFrom', from)
    if (to) params.set('dateTo', to)
    fetch(`/api/admin/companies?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setGroups(data); setLoading(false) })
  }, [])

  useEffect(() => { fetchGroups(appliedFrom, appliedTo) }, [fetchGroups, appliedFrom, appliedTo])

  function handleApplyFilter() {
    setAppliedFrom(dateFrom)
    setAppliedTo(dateTo)
  }

  function handleClearDates() {
    setDateFrom('')
    setDateTo('')
    setAppliedFrom('')
    setAppliedTo('')
  }

  const filtered = groups.filter(g =>
    g.company.toLowerCase().includes(search.toLowerCase())
  )

  function handlePrintAll() {
    const html = generatePrintHTML(filtered, dateFrom, dateTo, 'Relatório Geral por Empresa')
    printReport(html)
  }

  function handlePrintCompany() {
    if (!selectedCompany) return
    const group = filtered.find(g => g.company === selectedCompany)
    if (!group) return
    const html = generatePrintHTML([group], dateFrom, dateTo, `Relatório — ${group.company}`)
    printReport(html)
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  }

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

        {/* Filtros */}
        <div style={{ background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 18px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#555b6e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Filtros
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            {/* Busca */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', color: '#555b6e' }}>Empresa</label>
              <div style={{ position: 'relative' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555b6e" strokeWidth="2"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '30px', width: '180px' }}
                />
              </div>
            </div>

            {/* Data de */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', color: '#555b6e' }}>De</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{ ...inputStyle, width: '150px', colorScheme: 'dark' }}
              />
            </div>

            {/* Data até */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', color: '#555b6e' }}>Até</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{ ...inputStyle, width: '150px', colorScheme: 'dark' }}
              />
            </div>

            {/* Aplicar */}
            <button
              onClick={handleApplyFilter}
              style={{ ...btnBase, background: 'rgba(29,214,246,0.1)', color: '#1DD6F6', border: '1px solid rgba(29,214,246,0.15)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              Aplicar
            </button>

            {/* Limpar */}
            {(appliedFrom || appliedTo) && (
              <button
                onClick={handleClearDates}
                style={{ ...btnBase, background: 'transparent', color: '#555b6e', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Limpar
              </button>
            )}

            <div style={{ marginLeft: 'auto' }}>
              {!loading && (
                <span style={{ fontSize: '12px', color: '#3a3f50' }}>
                  {filtered.length} {filtered.length === 1 ? 'empresa' : 'empresas'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ações PDF */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* PDF Geral */}
          <button
            onClick={handlePrintAll}
            disabled={filtered.length === 0}
            style={{
              ...btnBase,
              background: filtered.length === 0 ? 'rgba(29,214,246,0.04)' : 'rgba(29,214,246,0.1)',
              color: filtered.length === 0 ? '#3a3f50' : '#1DD6F6',
              border: '1px solid rgba(29,214,246,0.15)',
              cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M3 7V4a1 1 0 011-1h5l2 3h8a1 1 0 011 1v3" />
            </svg>
            Baixar PDF geral
          </button>

          {/* Divisor */}
          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Select empresa + botão */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              style={{
                ...inputStyle, width: '220px',
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="">Selecionar empresa...</option>
              {filtered.map(g => (
                <option key={g.company} value={g.company}>{g.company}</option>
              ))}
            </select>
            <button
              onClick={handlePrintCompany}
              disabled={!selectedCompany}
              style={{
                ...btnBase,
                background: selectedCompany ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.04)',
                color: selectedCompany ? '#a855f7' : '#3a3f50',
                border: '1px solid rgba(168,85,247,0.15)',
                cursor: selectedCompany ? 'pointer' : 'not-allowed',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              PDF por empresa
            </button>
          </div>
        </div>

        {/* Lista */}
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
