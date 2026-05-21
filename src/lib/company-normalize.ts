const COMPANY_ALIASES: Array<{ variants: string[], canonical: string, displayName: string }> = [
  {
    variants: ['expx', 'exponencial', 'software house exponencial', 'exponencial software house', 'swh exponencial'],
    canonical: 'expx',
    displayName: 'EXPX',
  },
  {
    variants: ['acougue integrado', 'acougue'],
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

const CORPORATE_SUFFIXES = new Set([
  'solutions', 'solution', 'solucoes', 'solucao',
  'servicos', 'services', 'service',
  'tecnologia', 'tech', 'technology', 'technologies',
  'sistemas', 'system', 'systems',
  'consultoria', 'consulting', 'consultores',
  'ltda', 'lda',
  'sa', 'mei', 'eireli', 'epp',
  'grupo', 'group',
  'brasil', 'brazil', 'br',
  'comercial', 'commercial',
  'enterprise', 'enterprises',
  'international', 'internacional',
  'corp', 'corporation', 'inc',
  'software', 'softwares',
  'informatica', 'informacao',
])

export function normalizeCompanyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim()
    .split(' ')
    .filter(token => token.length > 0 && !CORPORATE_SUFFIXES.has(token))
    .join(' ')
    .trim()
}

export function resolveCompanyKey(rawName: string): string {
  const normalized = normalizeCompanyKey(rawName)
  for (const alias of COMPANY_ALIASES) {
    if (alias.variants.some(v => normalized.includes(v) || v.includes(normalized))) {
      return alias.canonical
    }
  }
  return normalized
}

export function getCompanyDisplayName(canonical: string, fallback: string): string {
  return COMPANY_ALIASES.find(a => a.canonical === canonical)?.displayName ?? fallback
}
