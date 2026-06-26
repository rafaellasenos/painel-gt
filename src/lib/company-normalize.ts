export function normalizeCompanyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim()
}

export function resolveCompanyKey(rawName: string): string {
  return normalizeCompanyKey(rawName)
}

export function getCompanyDisplayName(_canonical: string, fallback: string): string {
  return fallback
}
