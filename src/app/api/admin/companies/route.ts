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

// Sufixos corporativos que não diferenciam empresas
const CORPORATE_SUFFIXES = [
  'solutions', 'solution', 'solucoes', 'solução', 'solucao',
  'servicos', 'serviços', 'services', 'service',
  'tecnologia', 'tech', 'technology', 'technologies',
  'sistemas', 'system', 'systems',
  'consultoria', 'consulting', 'consultores',
  'ltda', 'ltda.', 'lda', 'lda.',
  'sa', 's.a', 's.a.', 'sa.',
  'me', 'm.e', 'mei', 'eireli',
  'epp', 'ss', 's/s',
  'grupo', 'group',
  'brasil', 'brazil', 'br',
  'commercial', 'comercial',
  'enterprise', 'enterprises',
  'international', 'internacional',
  'corp', 'corporation', 'inc',
]

function normalizeCompanyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    // Remove acentos
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    // Remove pontuação exceto espaço e hífen
    .replace(/[^\w\s-]/g, '')
    // Colapsa espaços múltiplos e hífens
    .replace(/[-\s]+/g, ' ')
    .trim()
    // Remove sufixos corporativos do final
    .split(' ')
    .filter(token => !CORPORATE_SUFFIXES.includes(token))
    .join(' ')
    .trim()
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

  // Agrupa por chave normalizada, exibindo o nome mais completo do grupo
  const map = new Map<string, CompanyGroup & { _variants: string[] }>()

  for (const row of data) {
    const rawName = row.company.trim()
    const key = normalizeCompanyKey(rawName)

    if (!map.has(key)) {
      map.set(key, { company: rawName, total: 0, collaborators: [], _variants: [rawName] })
    }

    const group = map.get(key)!

    // Mantém o nome mais completo (mais caracteres) como nome de exibição
    if (rawName.length > group.company.length) {
      group.company = rawName
    }
    group._variants.push(rawName)
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
    .map(({ _variants: _, ...g }) => g)
    .sort((a, b) => a.company.localeCompare(b.company, 'pt-BR', { sensitivity: 'base' }))

  return NextResponse.json(groups)
}
