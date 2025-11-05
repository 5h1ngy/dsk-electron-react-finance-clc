import { mapProductsToProfile } from './index'
import type { RiskScoreResult } from '@engines/scoring'

const baseScore: RiskScoreResult = {
  score: 55,
  riskClass: 'Prudente',
  volatilityBand: 'Media',
  missingAnswers: [],
  rationales: []
}

describe('mapProductsToProfile', () => {
  it('filters products by allowed bands and keeps one per category', () => {
    const products = [
      { name: 'Alpha', category: 'Azioni', riskBand: 'Medio-Bassa' },
      { name: 'Beta', category: 'Azioni', riskBand: 'Medio-Bassa' },
      { name: 'Gamma', category: 'Obbligazionari', riskBand: 'Alta' }
    ]

    const recommendations = mapProductsToProfile(baseScore, products)

    expect(recommendations).toHaveLength(1)
    expect(recommendations[0]).toMatchObject({
      category: 'Azioni',
      name: 'Alpha'
    })
  })

  it('falls back to a translated match reason when description is missing', () => {
    const products = [{ name: 'Theta', category: 'Bilanciati', riskBand: 'Bassa' }]

    const [recommendation] = mapProductsToProfile(
      { ...baseScore, riskClass: 'Conservativo' },
      products
    )

    expect(recommendation.matchReason).toContain('Categoria Bilanciati')
  })

  it('applies the provided limit to the resulting list', () => {
    const products = Array.from({ length: 5 }, (_, index) => ({
      name: `Prodotto ${index}`,
      category: `Categoria ${index}`,
      riskBand: 'Medio-Bassa'
    }))

    const recommendations = mapProductsToProfile(baseScore, products, 2)

    expect(recommendations).toHaveLength(2)
  })

  it('permits risk classes as product labels up to the client tolerance', () => {
    const products = [
      { name: 'Stable Income', category: 'Obbligazionari', riskBand: 'Prudente' },
      { name: 'Aggressive Growth', category: 'Azioni', riskBand: 'Dinamico' }
    ]

    const recommendations = mapProductsToProfile(
      { ...baseScore, riskClass: 'Bilanciato' },
      products
    )

    expect(recommendations).toHaveLength(1)
    expect(recommendations[0].name).toBe('Stable Income')
  })
})
