import {
  productUniverseReducer,
  setProductUniverse,
  setRecommendations,
  buildRecommendations
} from './slice'

import { mapProductsToProfile } from '@engines/mapping'

jest.mock('@engines/mapping', () => ({
  mapProductsToProfile: jest.fn(() => [{ name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa' }])
}))

describe('productUniverse slice', () => {
  it('stores products and categories independently', () => {
    const state = productUniverseReducer(
      undefined,
      setProductUniverse({
        products: [{ name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa' }],
        categories: [{ name: 'Azioni', count: 1 }]
      })
    )
    expect(state.products).toHaveLength(1)
    expect(state.categories[0].name).toBe('Azioni')
  })

  it('updates recommendations list', () => {
    const state = productUniverseReducer(
      undefined,
      setRecommendations([
        { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Motivo' }
      ])
    )
    expect(state.recommendations).toHaveLength(1)
  })

  it('delegates recommendation building to the mapping engine', () => {
    const recommendations = buildRecommendations(
      {
        score: 70,
        riskClass: 'Prudente',
        volatilityBand: 'Media',
        missingAnswers: [],
        rationales: []
      },
      []
    )
    expect(mapProductsToProfile).toHaveBeenCalled()
    expect(recommendations).toHaveLength(1)
  })
})
