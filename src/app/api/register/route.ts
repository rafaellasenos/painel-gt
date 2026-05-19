import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email: role, company } = body

    const errors: Record<string, string> = {}
    if (!name || name.trim().length < 2) errors.name = 'Nome deve ter pelo menos 2 caracteres'
    if (!role || role.trim().length < 2) errors.email = 'Preencha seu cargo ou função'
    if (!company || company.trim().length < 2) errors.company = 'Nome da empresa deve ter pelo menos 2 caracteres'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Busca link e título atual antes de inserir
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['meet_link', 'meeting_title'])

    if (settingsError) {
      return NextResponse.json({ error: 'Reunião não disponível no momento. Entre em contato com o organizador.' }, { status: 503 })
    }

    const settingsMap = (settings ?? []).reduce((acc: Record<string, string>, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    const meetLink = settingsMap['meet_link'] ?? ''
    const meetTitle = settingsMap['meeting_title'] ?? ''

    if (!meetLink || meetLink === 'https://meet.google.com/configure-seu-link') {
      return NextResponse.json({ error: 'Reunião não disponível no momento. Entre em contato com o organizador.' }, { status: 503 })
    }

    // Salva o registro com o GT atual
    const { error: insertError } = await supabase
      .from('registrations')
      .insert({
        name: name.trim(),
        email: role.trim(),
        company: company.trim(),
        meeting_title: meetTitle,
        ip_address: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
        user_agent: request.headers.get('user-agent') ?? null,
      })

    if (insertError) {
      console.error('[register] Insert error:', insertError)
      return NextResponse.json({ error: 'Erro ao salvar registro. Tente novamente.' }, { status: 503 })
    }

    return NextResponse.json({ success: true, meetLink })

  } catch {
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
