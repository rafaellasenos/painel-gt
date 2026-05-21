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

// Aliases fixos: variações -> { chave normalizada, nome de exibição }
// Usado para empresas cujos nomes base são diferentes mas representam a mesma empresa.
// A normalização automática (maiúsculas, acentos, sufixos) já resolve muitos casos.
const COMPANY_ALIASES: Array<{ variants: string[], canonical: string, displayName: string }> = [
  {
    variants: ['expx', 'exponencial', 'software house exponencial', 'exponencial software house', 'swh exponencial'],
    canonical: 'expx',
    displayName: 'EXPX',
  },
  {
    variants: ['acougue integrado', 'acougue', 'acougue integrado'],
    canonical: 'acougue integrado',
    displayName: 'Açougue Integrado',
  },
  {
    variants: ['2m', '2m solutions', '2m solutions tecnologia'],
    canonical: '2m',
    displayName: '2M Solutions',
  },
  {
    variants: ['andes', 'andes sistemas'],
    canonical: 'andes',
    displayName: 'AnDes Sistemas',
  },
  {
    variants: ['certtus', 'certtjs'],
    canonical: 'certtus',
    displayName: 'Certtus',
  },
  {
    variants: ['codemed'],
    canonical: 'codemed',
    displayName: 'Codemed',
  },
  {
    variants: ['concept', 'concep', 'concept automacao', 'concept automacao comercial'],
    canonical: 'concept',
    displayName: 'Concept Automação Comercial',
  },
  {
    variants: ['dsoft', 'desenvolvimento de sistemas'],
    canonical: 'dsoft',
    displayName: 'DSoft Solutions',
  },
  {
    variants: ['efisim'],
    canonical: 'efisim',
    displayName: 'Efisim Sistemas',
  },
  {
    variants: ['elite consultores', 'elite consultoria contabil', 'elite consultoria'],
    canonical: 'elite',
    displayName: 'Elite Consultores',
  },
  {
    variants: ['everest', 'everest softwares', 'solaryum everest'],
    canonical: 'everest',
    displayName: 'Everest Software',
  },
  {
    variants: ['explend', 'explend solucoes', 'explend solucoes empresariais'],
    canonical: 'explend',
    displayName: 'Explend Soluções Empresariais',
  },
  {
    variants: ['exsis', 'exsis tecnologia', 'exsis tecnologia da informacao'],
    canonical: 'exsis',
    displayName: 'Exsis Tecnologia da Informação',
  },
  {
    variants: ['fontdata', 'fontdata tecnologia', 'fontdata tenologia'],
    canonical: 'fontdata',
    displayName: 'Fontdata Tecnologia e Inovação',
  },
  {
    variants: ['frontsys', 'frontsys sistema'],
    canonical: 'frontsys',
    displayName: 'Frontsys',
  },
  {
    variants: ['g2'],
    canonical: 'g2',
    displayName: 'G2 Sistemas',
  },
  {
    variants: ['gr7', 'gr7 autocom'],
    canonical: 'gr7',
    displayName: 'GR7 Autocom',
  },
  {
    variants: ['imendes', 'grupo imendes'],
    canonical: 'imendes',
    displayName: 'Grupo IMendes',
  },
  {
    variants: ['imonov', 'si9', 'si9 sistemas'],
    canonical: 'si9',
    displayName: 'Si9 Sistemas',
  },
  {
    variants: ['industrialmais'],
    canonical: 'industrialmais',
    displayName: 'IndustrialMais',
  },
  {
    variants: ['jamsoft', 'jamsfot'],
    canonical: 'jamsoft',
    displayName: 'JAMSOFT Sistemas',
  },
  {
    variants: ['lc', 'lc sistemas'],
    canonical: 'lc',
    displayName: 'LC Sistemas',
  },
  {
    variants: ['microrib', 'microrib software'],
    canonical: 'microrib',
    displayName: 'Microrib Software',
  },
  {
    variants: ['mma', 'mma sistemas', 'mma-sistemas'],
    canonical: 'mma',
    displayName: 'MMA Sistemas',
  },
  {
    variants: ['multilogica', 'multilogica informatica', 'multilogica softwares'],
    canonical: 'multilogica',
    displayName: 'Multilógica Informática',
  },
  {
    variants: ['new standard', 'new standard software'],
    canonical: 'new standard',
    displayName: 'New Standard Software',
  },
  {
    variants: ['noagro'],
    canonical: 'noagro',
    displayName: 'Noagro Sistemas',
  },
  {
    variants: ['nota delivery'],
    canonical: 'nota delivery',
    displayName: 'Nota Delivery',
  },
  {
    variants: ['pbnew', 'pbnew sistemas'],
    canonical: 'pbnew',
    displayName: 'PBNEW Sistemas',
  },
  {
    variants: ['promedico', 'promedico gestao hospitalar'],
    canonical: 'promedico',
    displayName: 'Promedico Gestão Hospitalar',
  },
  {
    variants: ['prorius', 'prorius tecnologia'],
    canonical: 'prorius',
    displayName: 'Prorius Tecnologia',
  },
  {
    variants: ['prosystem', 'prosystem sistemas'],
    canonical: 'prosystem',
    displayName: 'Prosystem',
  },
  {
    variants: ['saam', 'saam auditoria'],
    canonical: 'saam',
    displayName: 'SAAM Auditoria',
  },
  {
    variants: ['servicelogic', 'service logic'],
    canonical: 'servicelogic',
    displayName: 'ServiceLogic',
  },
  {
    variants: ['sismais', 'sismais tecnologia'],
    canonical: 'sismais',
    displayName: 'Sismais Tecnologia',
  },
  {
    variants: ['sistec'],
    canonical: 'sistec',
    displayName: 'Sistec',
  },
  {
    variants: ['sistema ram'],
    canonical: 'sistema ram',
    displayName: 'Sistema RAM',
  },
  {
    variants: ['softhouse'],
    canonical: 'softhouse',
    displayName: 'Softhouse',
  },
  {
    variants: ['ta tecnologia'],
    canonical: 'ta tecnologia',
    displayName: 'TÁ Tecnologia',
  },
  {
    variants: ['tech shop'],
    canonical: 'tech shop',
    displayName: 'Tech Shop',
  },
  {
    variants: ['tef.net', 'tef net', 'tef net solucoes em meios de pagamentos', 'tef.net solucoes'],
    canonical: 'tef net',
    displayName: 'TEF.NET Soluções em Meios de Pagamentos',
  },
  {
    variants: ['thr', 'thr softwares'],
    canonical: 'thr',
    displayName: 'ThR Softwares',
  },
  {
    variants: ['toglab', 'tog lab'],
    canonical: 'toglab',
    displayName: 'TogLab',
  },
  {
    variants: ['ts tecnologia'],
    canonical: 'ts tecnologia',
    displayName: 'TS Tecnologia',
  },
  {
    variants: ['viggo', 'viggo sistemas'],
    canonical: 'viggo',
    displayName: 'Viggo Sistemas',
  },
  {
    variants: ['weber', 'weber sistemas', 'weber sistemas de gestao'],
    canonical: 'weber',
    displayName: 'Weber Sistemas de Gestão',
  },
  {
    variants: ['wmc', 'wmc tecnologia'],
    canonical: 'wmc',
    displayName: 'WMC Tecnologia',
  },
  {
    variants: ['ww erp'],
    canonical: 'ww erp',
    displayName: 'WW ERP',
  },
  {
    variants: ['zion', 'zion logtec', 'zion logtec tecnologia em logistica'],
    canonical: 'zion',
    displayName: 'Zion Logtec',
  },
  {
    variants: ['automafour', 'automafour solucoes em informatica'],
    canonical: 'automafour',
    displayName: 'Automafour Soluções em Informática',
  },
  {
    variants: ['solution', 'solution desenvolvimento'],
    canonical: 'solution',
    displayName: 'Solution Desenvolvimento',
  },
  {
    variants: ['sd', 'system design'],
    canonical: 'system design',
    displayName: 'System Design',
  },
]

function resolveAlias(normalizedKey: string): string {
  for (const alias of COMPANY_ALIASES) {
    if (alias.variants.some((v: string) => normalizedKey.includes(v) || v.includes(normalizedKey))) {
      return alias.canonical
    }
  }
  return normalizedKey
}

function getAliasDisplayName(canonical: string): string | null {
  return COMPANY_ALIASES.find(a => a.canonical === canonical)?.displayName ?? null
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
    const key = resolveAlias(normalizeCompanyKey(rawName))

    if (!map.has(key)) {
      const displayName = getAliasDisplayName(key) ?? rawName
      map.set(key, { company: displayName, total: 0, collaborators: [], _variants: [rawName] })
    }

    const group = map.get(key)!

    // Se não for alias fixo, mantém o nome mais completo como exibição
    if (!getAliasDisplayName(key) && rawName.length > group.company.length) {
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
