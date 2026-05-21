import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resolveCompanyKey, getCompanyDisplayName } from '@/lib/company-normalize'

export interface CompanyGroup {
  company: string
  total: number
  collaborators: {
    id: string
    name: string
    email: string
    meeting_title: string
    created_at: string
  }[]
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const dateFrom = searchParams.get('dateFrom') ?? ''
  const dateTo = searchParams.get('dateTo') ?? ''

  const admin = createAdminClient()
  let query = admin
    .from('registrations')
    .select('id, name, email, company, meeting_title, created_at')

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) {
    const end = new Date(dateTo)
    end.setHours(23, 59, 59, 999)
    query = query.lte('created_at', end.toISOString())
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const map = new Map<string, CompanyGroup & { _hasAlias: boolean }>()

  for (const row of data) {
    const rawName = row.company.trim()
    const key = resolveCompanyKey(rawName)
    const aliasDisplay = getCompanyDisplayName(key, '')

    if (!map.has(key)) {
      map.set(key, {
        company: aliasDisplay || rawName,
        total: 0,
        collaborators: [],
        _hasAlias: !!aliasDisplay,
      })
    }

    const group = map.get(key)!
    if (!group._hasAlias && rawName.length > group.company.length) {
      group.company = rawName
    }
    group.total += 1
    group.collaborators.push({
      id: row.id,
      name: row.name,
      email: row.email,
      meeting_title: row.meeting_title ?? '',
      created_at: row.created_at,
    })
  }

  const groups = Array.from(map.values())
    .map(({ _hasAlias: _, ...g }) => g)
    .sort((a, b) => a.company.localeCompare(b.company, 'pt-BR', { sensitivity: 'base' }))

  return NextResponse.json(groups)
}
