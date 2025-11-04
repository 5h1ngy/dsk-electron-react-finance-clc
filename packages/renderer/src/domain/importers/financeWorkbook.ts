import { read, utils } from 'xlsx'

import type { ProductRecord } from '@renderer/domain/mapping/rules'

export interface FinanceUniverseSummary {
  instruments: number
  categories: Array<{ name: string; count: number }>
  products: ProductRecord[]
}

const guessKey = (headers: string[], keywords: string[]): string | undefined =>
  headers.find((header) => {
    const normalized = header.toLowerCase()
    return keywords.some((keyword) => normalized.includes(keyword))
  })

const normalizeLabel = (value: unknown, fallback: string): string => {
  const label = String(value ?? '').trim()
  return label.length ? label : fallback
}

export const parseFinanceWorkbook = async (file: File): Promise<FinanceUniverseSummary> => {
  const buffer = await file.arrayBuffer()
  const workbook = read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) {
    throw new Error('Workbook universo prodotti non valido')
  }
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  if (!rows.length) {
    return { instruments: 0, categories: [], products: [] }
  }

  const headers = Object.keys(rows[0] ?? {})
  const categoryKey = guessKey(headers, ['categoria', 'category', 'linea', 'profilo']) ?? headers[0]
  const nameKey = guessKey(headers, ['nome', 'strumento', 'prodotto']) ?? categoryKey
  const riskKey = guessKey(headers, ['rischio', 'risk', 'banda']) ?? categoryKey
  const descriptionKey = guessKey(headers, ['descrizione', 'description', 'note'])

  const categoryCounter = new Map<string, number>()
  const products: ProductRecord[] = []

  rows.forEach((row, index) => {
    const category = normalizeLabel(row[categoryKey], 'Non specificato')
    const name = normalizeLabel(row[nameKey], `Strumento ${index + 1}`)
    const riskBand = normalizeLabel(row[riskKey], 'Bassa')
    const description = descriptionKey ? normalizeLabel(row[descriptionKey], '') : undefined

    categoryCounter.set(category, (categoryCounter.get(category) ?? 0) + 1)
    products.push({
      name,
      category,
      riskBand,
      description
    })
  })

  const categories = Array.from(categoryCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    instruments: rows.length,
    categories,
    products
  }
}
