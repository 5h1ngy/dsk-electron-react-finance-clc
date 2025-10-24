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

export const mapProductsToProfile = (
  score: RiskScoreResult,
  products: ProductRecord[],
  limit = 8
): ProductRecommendation[] => {
  const riskClass = resolveRiskClass(score.riskClass)
  const allowedBands = new Set(riskToBands[riskClass])
  const filtered = products.filter((product) => allowedBands.has(product.riskBand))

  const uniqueByCategory = new Map<string, ProductRecommendation>()

  filtered.forEach((product, index) => {
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

