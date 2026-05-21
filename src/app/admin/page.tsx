'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'

const GT_LIST = [
  'GT - Gestão e Estratégia',
  'GT - Pessoas e Processos',
  'GT - Marketing e Vendas',
  'GT - IA e Inovação',
]

interface Stats {
  total: number
  today: number
  week: number
  byGT: Record<string, number>
  topCompanies: Array<{ company: string; count: number }>
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ background: '#0d0d20', borderRadius: '16px', border: `1px solid ${color}20`, padding: '24px', transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#555b6e', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '32px', letterSpacing: '-1px', color: '#f0f2f5', marginTop: '6px' }}>{value.toLocaleString('pt-BR')}</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, week: 0, byGT: {}, topCompanies: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) return
        const data = await res.json()
        setStats(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const ranking = stats.topCompanies
  const maxRank = ranking[0]?.count ?? 1

  return (
    <AdminLayout>
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#f0f2f5', marginBottom: '28px' }}>Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total de Registros" value={stats.total} color="#1DD6F6" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DD6F6" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } />
          <StatCard label="Hoje" value={stats.today} color="#38B109" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38B109" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/></svg>
          } />
          <StatCard label="Últimos 7 dias" value={stats.week} color="#f0c040" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0c040" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
          } />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Gráfico GT */}
          <div style={{ background: '#0d0d20', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '28px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555b6e', marginBottom: '24px' }}>Participações por GT</h2>
            {loading ? (
              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555b6e', fontSize: '14px' }}>Carregando...</div>
            ) : (() => {
              const gtCounts = GT_LIST.map(gt => ({
                label: gt.replace('GT - ', ''),
                full: gt,
                count: stats.byGT[gt] ?? 0,
              }))
              const maxGT = Math.max(...gtCounts.map(g => g.count), 1)
              const colors = ['#1DD6F6', '#38B109', '#f0c040', '#818cf8']
              return (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
                  {gtCounts.map((gt, i) => (
                    <div key={gt.full} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                      {gt.count > 0 && (
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors[i], fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{gt.count}</span>
                      )}
                      <div style={{ width: '100%', position: 'relative', height: `${Math.max((gt.count / maxGT) * 100, gt.count === 0 ? 4 : 8)}%`, minHeight: '4px' }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: gt.count === 0 ? 'rgba(255,255,255,0.04)' : `linear-gradient(180deg, ${colors[i]}, ${colors[i]}99)`,
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.6s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#555b6e', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{gt.label}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>

          {/* Ranking */}
          <div style={{ background: '#0d0d20', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', padding: '28px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555b6e', marginBottom: '20px' }}>Ranking de Participações</h2>
            {loading ? (
              <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555b6e', fontSize: '14px' }}>Carregando...</div>
            ) : ranking.length === 0 ? (
              <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555b6e', fontSize: '14px' }}>Nenhum registro ainda</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ranking.map((item, i) => {
                  const medals = ['🥇', '🥈', '🥉']
                  const pct = Math.round((item.count / maxRank) * 100)
                  return (
                    <div key={item.company} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', width: '20px', textAlign: 'center', flexShrink: 0 }}>
                        {medals[i] ?? <span style={{ fontSize: '11px', fontWeight: 700, color: '#555b6e' }}>{i + 1}</span>}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#c8ccd4', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.company}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1DD6F6', flexShrink: 0, marginLeft: '8px' }}>{item.count}</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg, #38B109, #1DD6F6)' : 'rgba(29,214,246,0.4)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
