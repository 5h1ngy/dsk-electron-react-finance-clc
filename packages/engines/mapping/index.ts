import type { ProductRecord, ProductRecommendation, RiskClass } from '@engines/mapping/rules'
import { riskOrder, riskToBands } from '@engines/mapping/rules'
import type { RiskScoreResult } from '@engines/scoring'
import i18n from '@renderer/i18n'

const resolveRiskClass = (riskClass: string): RiskClass => {
  if (riskOrder.includes(riskClass as RiskClass)) {
    return riskClass as RiskClass
  }
  return 'Prudente'
}

const toKey = (value: string) => value.trim().toLowerCase()

const bandSynonyms: Record<string, string> = {
  low: 'bassa',
  medium: 'medio',
  high: 'alta',
  'medium low': 'medio-bassa',
  'medium-low': 'medio-bassa',
  'medio bassa': 'medio-bassa',
  'medio-basso': 'medio-bassa',
  'medio basso': 'medio-bassa'
}

export const mapProductsToProfile = (
  score: RiskScoreResult,
  products: ProductRecord[],
  limit = 8
): ProductRecommendation[] => {
  const riskClass = resolveRiskClass(score.riskClass)
  const allowedBands = new Set(riskToBands[riskClass])
  const allowedBandsNormalized = new Set(Array.from(allowedBands).map(toKey))
  const riskClassIndex = riskOrder.indexOf(riskClass)

  const matchesProfile = (product: ProductRecord) => {
    const rawLabel = product.riskBand ?? ''
    const normalized = toKey(rawLabel)
    if (!normalized.length) {
      return false
    }

    if (allowedBandsNormalized.has(normalized)) {
      return true
    }

    const synonym = bandSynonyms[normalized]
    if (synonym && allowedBandsNormalized.has(synonym)) {
      return true
    }

    const productClassIndex = riskOrder.findIndex(
      (item) => item.toLowerCase() === normalized
    )
    if (productClassIndex !== -1) {
      return productClassIndex <= riskClassIndex
    }

    return false
  }

  const filtered = products.filter(matchesProfile)

  const uniqueByCategory = new Map<string, ProductRecommendation>()

  filtered.forEach((product) => {
    const current = uniqueByCategory.get(product.category)
    const recommendation: ProductRecommendation = {
      ...product,
      matchReason:
        product.description ??
        i18n.t('mapping.matchReason', {
          category: product.category,
          band: product.riskBand
        })
    }

    if (!current) {
      uniqueByCategory.set(product.category, recommendation)
      return
    }

    if (product.name.localeCompare(current.name) < 0) {
      uniqueByCategory.set(product.category, recommendation)
    }
  })

  return Array.from(uniqueByCategory.values()).slice(0, limit)
}
