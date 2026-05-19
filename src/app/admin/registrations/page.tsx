'use client'

import { useEffect, useState, useCallback } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import type { Registration } from '@/lib/types'

export default function RegistrationsPage() {
  const [data, setData] = useState<Registration[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const buildParams = useCallback((p: number) => {
    const params = new URLSearchParams({ page: String(p), limit: '20' })
    if (search) params.set('search', search)
    if (company) params.set('company', company)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    return params.toString()
  }, [search, company, dateFrom, dateTo])

  async function load(p: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/registrations?${buildParams(p)}`)
      const json = await res.json()
      setData(json.data ?? [])
      setTotal(json.total ?? 0)
      setTotalPages(json.totalPages ?? 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { setPage(1); load(1) }, [search, company, dateFrom, dateTo])
  useEffect(() => { load(page) }, [page])

  async function handleExportPDF() {
    setExporting(true)
    try {
      // Busca todos os registros com filtros ativos (sem paginação)
      const params = new URLSearchParams({ page: '1', limit: '1000' })
      if (search) params.set('search', search)
      if (company) params.set('company', company)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const res = await fetch(`/api/admin/registrations?${params.toString()}`)
      const json = await res.json()
      const rows: Registration[] = json.data ?? []

      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'landscape' })

      // Header
      doc.setFillColor(13, 13, 32)
      doc.rect(0, 0, 297, 297, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(240, 242, 245)
      doc.text('Relatório de Participações', 14, 20)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(85, 91, 110)
      doc.text(`Gerado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}  •  ${rows.length} registro${rows.length !== 1 ? 's' : ''}`, 14, 28)

      autoTable(doc, {
        startY: 36,
        head: [['Nome', 'Cargo', 'Empresa', 'GT', 'Data/Hora']],
        body: rows.map(r => [
          r.name,
          r.email,
          r.company,
          r.meeting_title ?? '—',
          new Date(r.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ]),
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 6,
          textColor: [192, 200, 212],
          fillColor: [13, 13, 32],
          lineColor: [30, 30, 50],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [8, 8, 24],
          textColor: [29, 214, 246],
          fontStyle: 'bold',
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [18, 18, 42],
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 65 },
          4: { cellWidth: 40 },
        },
      })

      doc.save(`registros-${new Date().toISOString().split('T')[0]}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <AdminLayout>
      <div style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#f0f2f5' }}>Registros</h1>
            <p style={{ fontSize: '13px', color: '#555b6e', marginTop: '4px' }}>
              {total} participante{total !== 1 ? 's' : ''} no total
            </p>
          </div>
          <Button variant="secondary" onClick={handleExportPDF} loading={exporting}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            {exporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </Button>
        </div>

        {/* Filtros */}
        <div style={{ background: '#0d0d20', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <Input id="search" label="Buscar por nome ou cargo" type="text" placeholder="Digite para buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input id="company" label="Empresa" type="text" placeholder="Filtrar por empresa" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input id="dateFrom" label="Data inicial" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <Input id="dateTo" label="Data final" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        {/* Tabela */}
        <div style={{ background: '#0d0d20', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Nome', 'Cargo', 'Empresa', 'GT', 'Data/Hora'].map(col => (
                  <th key={col} style={{ textAlign: 'left', padding: '14px 18px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#555b6e', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#555b6e', fontSize: '14px' }}>Carregando...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#555b6e', fontSize: '14px' }}>Nenhum registro encontrado</td></tr>
              ) : (
                data.map((r) => (
                  <tr key={r.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#f0f2f5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.name}</td>
                    <td style={{ padding: '14px 18px', color: '#8a90a0' }}>{r.email}</td>
                    <td style={{ padding: '14px 18px', color: '#8a90a0' }}>{r.company}</td>
                    <td style={{ padding: '14px 18px' }}>
                      {r.meeting_title ? (
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'rgba(29,214,246,0.08)', border: '1px solid rgba(29,214,246,0.2)', color: '#1DD6F6', whiteSpace: 'nowrap' }}>
                          {r.meeting_title}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#2a2e3d' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#555b6e', fontSize: '12px' }}>
                      {new Date(r.created_at).toLocaleString('pt-BR', {
                        timeZone: 'America/Sao_Paulo',
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontSize: '12px', color: '#555b6e' }}>Página {page} de {totalPages}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Anterior</Button>
                <Button variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Próxima →</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
