const BLOCKED_VALUES = new Set([
  'nome', 'name', 'meu nome', 'meu nome completo',
  'empresa', 'minha empresa', 'company', 'my company',
  'eu', 'me', 'eu mesmo', 'user', 'usuario', 'usuário',
  'teste', 'test', 'testing', 'tester',
  'admin', 'administrador',
  'fulano', 'beltrano', 'ciclano', 'fulano de tal',
  'joao', 'joão', 'jose', 'josé', 'maria', 'ana',
  'nao sei', 'não sei', 'sem nome', 'anonimo', 'anônimo',
  'xxx', 'yyy', 'zzz', 'abc', 'aaa', 'bbb', 'ccc',
  'qq', 'qq', 'sd', 'asdf', 'qwerty',
  'cargo', 'funcao', 'função', 'meu cargo',
  'colaborador', 'funcionario', 'funcionário',
])

// Bloqueia sequências repetitivas de vogais (aa, ee, ii, oo, uu, aaa, etc.)
const REPEATED_VOWELS = /([aeiouáéíóúâêîôûãõàèìòùäëïöü])\1{1,}/i

// Bloqueia strings feitas só de vogais ou consoantes repetidas (ex: "aaaa", "bbbbb")
const ONLY_REPEATED_CHARS = /^(.)\1+$/

// Só permite letras (incluindo acentuadas), números, espaço, hífen e apóstrofo
const ALLOWED_CHARS = /^[a-zA-ZÀ-ÿ0-9\s'\-&.]+$/

// Bloqueia valores com menos de 2 tokens não-triviais (ex: palavra única de 1-2 letras)
function hasMinimumTokens(value: string, min: number): boolean {
  const tokens = value.trim().split(/\s+/).filter(t => t.length >= 2)
  return tokens.length >= min
}

// Verifica se o valor parece ser uma sequência sem sentido
function isNonsense(value: string): boolean {
  const lower = value.trim().toLowerCase()

  if (ONLY_REPEATED_CHARS.test(lower)) return true
  if (REPEATED_VOWELS.test(lower)) return true

  // Bloqueio de strings muito curtas (1-2 chars após trim)
  if (lower.replace(/\s/g, '').length <= 2) return true

  // Sequências de teclado comuns
  const keyboardSequences = ['asdf', 'qwer', 'zxcv', 'hjkl', '1234', 'abcd']
  if (keyboardSequences.some(seq => lower.includes(seq))) return true

  return false
}

export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateName(value: string): ValidationResult {
  const trimmed = value.trim()

  if (!trimmed || trimmed.length < 3)
    return { valid: false, message: 'Nome muito curto. Informe seu nome completo.' }

  if (!ALLOWED_CHARS.test(trimmed))
    return { valid: false, message: 'Use apenas letras, números e espaços. Sem caracteres especiais.' }

  if (BLOCKED_VALUES.has(trimmed.toLowerCase()))
    return { valid: false, message: 'Por favor, informe seu nome real.' }

  if (isNonsense(trimmed))
    return { valid: false, message: 'Por favor, informe um nome válido.' }

  if (!hasMinimumTokens(trimmed, 2))
    return { valid: false, message: 'Informe seu nome completo (nome e sobrenome).' }

  return { valid: true }
}

export function validateRole(value: string): ValidationResult {
  const trimmed = value.trim()

  if (!trimmed || trimmed.length < 2)
    return { valid: false, message: 'Preencha seu cargo ou função.' }

  if (!ALLOWED_CHARS.test(trimmed))
    return { valid: false, message: 'Use apenas letras, números e espaços. Sem caracteres especiais.' }

  if (BLOCKED_VALUES.has(trimmed.toLowerCase()))
    return { valid: false, message: 'Por favor, informe seu cargo ou função real.' }

  if (isNonsense(trimmed))
    return { valid: false, message: 'Por favor, informe um cargo válido.' }

  return { valid: true }
}

export function validateCompany(value: string): ValidationResult {
  const trimmed = value.trim()

  if (!trimmed || trimmed.length < 2)
    return { valid: false, message: 'Nome da empresa muito curto.' }

  if (!ALLOWED_CHARS.test(trimmed))
    return { valid: false, message: 'Use apenas letras, números e espaços. Sem caracteres especiais.' }

  if (BLOCKED_VALUES.has(trimmed.toLowerCase()))
    return { valid: false, message: 'Por favor, informe o nome real da sua empresa.' }

  if (isNonsense(trimmed))
    return { valid: false, message: 'Por favor, informe um nome de empresa válido.' }

  return { valid: true }
}
