import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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

  if (dateFrom) {
    query = query.gte('created_at', dateFrom)
  }
  if (dateTo) {
    const end = new Date(dateTo)
    end.setHours(23, 59, 59, 999)
    query = query.lte('created_at', end.toISOString())
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const map = new Map<string, CompanyGroup>()

  for (const row of data) {
    const key = row.company.trim()
    if (!map.has(key)) {
      map.set(key, { company: key, total: 0, collaborators: [] })
    }
    const group = map.get(key)!
    group.total += 1
    group.collaborators.push({
      id: row.id,
      name: row.name,
      email: row.email,
      meeting_title: row.meeting_title ?? '',
      created_at: row.created_at,
    })
  }

  const groups = Array.from(map.values()).sort((a, b) => b.total - a.total)

  return NextResponse.json(groups)
}
