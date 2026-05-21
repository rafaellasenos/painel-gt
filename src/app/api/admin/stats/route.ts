import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resolveCompanyKey, getCompanyDisplayName } from '@/lib/company-normalize'

export interface DashboardStats {
  total: number
  today: number
  week: number
  byGT: Record<string, number>
  topCompanies: Array<{ company: string; count: number }>
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const admin = createAdminClient()

  // Total geral
  const { count: total } = await admin
    .from('registrations')
    .select('*', { count: 'exact', head: true })

  // Hoje (fuso Brasília: UTC-3)
  const nowUTC = new Date()
  const nowBrasilia = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000)
  const todayStart = new Date(nowBrasilia)
  todayStart.setHours(0, 0, 0, 0)
  const todayStartUTC = new Date(todayStart.getTime() + 3 * 60 * 60 * 1000)

  const { count: today } = await admin
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStartUTC.toISOString())

  // Últimos 7 dias
  const weekAgo = new Date(nowUTC.getTime() - 7 * 24 * 60 * 60 * 1000)
  const { count: week } = await admin
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo.toISOString())

  // Contagem por GT (meeting_title)
  const { data: gtData } = await admin
    .from('registrations')
    .select('meeting_title')

  const byGT: Record<string, number> = {}
  for (const row of gtData ?? []) {
    const gt = row.meeting_title ?? ''
    if (gt) byGT[gt] = (byGT[gt] ?? 0) + 1
  }

  // Top 10 empresas por contagem (com normalização/unificação igual à tela Por Empresa)
  const { data: companyData } = await admin
    .from('registrations')
    .select('company')

  const canonicalCounts = new Map<string, { displayName: string, count: number }>()
  for (const row of companyData ?? []) {
    const rawName = (row.company ?? '').trim()
    if (!rawName) continue
    const key = resolveCompanyKey(rawName)
    const displayName = getCompanyDisplayName(key, rawName)
    if (!canonicalCounts.has(key)) {
      canonicalCounts.set(key, { displayName, count: 0 })
    }
    const entry = canonicalCounts.get(key)!
    entry.count += 1
    // Mantém o nome mais completo se não houver alias fixo
    if (!getCompanyDisplayName(key, '') && rawName.length > entry.displayName.length) {
      entry.displayName = rawName
    }
  }

  const topCompanies = Array.from(canonicalCounts.values())
    .map(({ displayName, count }) => ({ company: displayName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return NextResponse.json({
    total: total ?? 0,
    today: today ?? 0,
    week: week ?? 0,
    byGT,
    topCompanies,
  } satisfies DashboardStats)
}
