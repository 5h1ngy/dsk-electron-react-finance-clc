import type { ProductRecord, ProductRecommendation, RiskClass } from ''@renderer/domain/mapping/rules''
import { riskOrder, riskToBands } from ''@renderer/domain/mapping/rules''
import type { RiskScoreResult } from ''@renderer/domain/scoring''

const riskClassPriority = (riskClass: RiskClass): number => riskOrder.indexOf(riskClass)

const resolveRiskClass = (riskClass: string): RiskClass => {
  if (riskOrder.includes(riskClass as RiskClass)) {
    return riskClass as RiskClass
  }
  return ''Prudente''
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

  filtered.forEach((product) => {
    const current = uniqueByCategory.get(product.category)
    if (!current) {
      uniqueByCategory.set(product.category, {
        ...product,
        matchReason: `Categoria ${product.category}, banda ${product.riskBand}`
      })
      return
    }
    if (product.name.localeCompare(current.name) < 0) {
      uniqueByCategory.set(product.category, {
        ...product,
        matchReason: `Categoria ${product.category}, banda ${product.riskBand}`
      })
    }
  })

  return Array.from(uniqueByCategory.values()).slice(0, limit)
}
