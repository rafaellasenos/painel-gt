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

  // Top 5 empresas — desempate: mais GTs distintos; se igual, alfabético
  const { data: companyData } = await admin
    .from('registrations')
    .select('company, meeting_title')

  const canonicalCounts = new Map<string, { displayName: string, count: number, gts: Set<string> }>()
  for (const row of companyData ?? []) {
    const rawName = (row.company ?? '').trim()
    if (!rawName) continue
    const key = resolveCompanyKey(rawName)
    const displayName = getCompanyDisplayName(key, rawName)
    if (!canonicalCounts.has(key)) {
      canonicalCounts.set(key, { displayName, count: 0, gts: new Set() })
    }
    const entry = canonicalCounts.get(key)!
    entry.count += 1
    if (row.meeting_title) entry.gts.add(row.meeting_title)
    if (!getCompanyDisplayName(key, '') && rawName.length > entry.displayName.length) {
      entry.displayName = rawName
    }
  }

  const topCompanies = Array.from(canonicalCounts.values())
    .map(({ displayName, count, gts }) => ({ company: displayName, count, gtCount: gts.size }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      if (b.gtCount !== a.gtCount) return b.gtCount - a.gtCount
      return a.company.localeCompare(b.company, 'pt-BR', { sensitivity: 'base' })
    })
    .slice(0, 5)
    .map(({ company, count }) => ({ company, count }))

  return NextResponse.json({
    total: total ?? 0,
    today: today ?? 0,
    week: week ?? 0,
    byGT,
    topCompanies,
  } satisfies DashboardStats)
}
