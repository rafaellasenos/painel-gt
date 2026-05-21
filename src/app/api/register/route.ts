import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { validateName, validateRole, validateCompany } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email: role, company } = body

    const errors: Record<string, string> = {}
    const nameResult = validateName(name ?? '')
    if (!nameResult.valid) errors.name = nameResult.message!
    const roleResult = validateRole(role ?? '')
    if (!roleResult.valid) errors.email = roleResult.message!
    const companyResult = validateCompany(company ?? '')
    if (!companyResult.valid) errors.company = companyResult.message!

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
