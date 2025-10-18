import { read, utils } from 'xlsx'

export interface FinanceUniverseSummary {
  instruments: number
  categories: Array<{ name: string; count: number }>
}

const guessCategoryKey = (headers: string[]): string | undefined =>
  headers.find((header) => {
    const normalized = header.toLowerCase()
    return (
      normalized.includes('categoria') ||
      normalized.includes('category') ||
      normalized.includes('linea') ||
      normalized.includes('profilo')
    )
  }) ?? headers[0]

export const parseFinanceWorkbook = async (file: File): Promise<FinanceUniverseSummary> => {
  const buffer = await file.arrayBuffer()
  const workbook = read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) {
    throw new Error('Workbook universo prodotti non valido')
  }
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  if (!rows.length) {
    return { instruments: 0, categories: [] }
  }

  const headers = Object.keys(rows[0] ?? {})
  const categoryKey = guessCategoryKey(headers)
  const categoryCounter = new Map<string, number>()

  rows.forEach((row) => {
    const categoryValue = row[categoryKey ?? ''] ?? 'Non specificato'
    const label = String(categoryValue).trim() || 'Non specificato'
    categoryCounter.set(label, (categoryCounter.get(label) ?? 0) + 1)
  })

  const categories = Array.from(categoryCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    instruments: rows.length,
    categories
  }
}
