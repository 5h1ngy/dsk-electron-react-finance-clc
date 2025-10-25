import { selectProducts, selectProductCategories, selectRecommendations } from './selectors'
import type { RootState } from '@renderer/store/types'

const state: Pick<RootState, 'productUniverse'> = {
  productUniverse: {
    products: [{ name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa' }],
    categories: [{ name: 'Azioni', count: 1 }],
    recommendations: [
      { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Match' }
    ]
  }
}

describe('productUniverse selectors', () => {
  it('selects memoized fields from the slice', () => {
    expect(selectProducts(state)).toEqual([
      { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa' }
    ])
    expect(selectProductCategories(state)).toEqual([{ name: 'Azioni', count: 1 }])
    expect(selectRecommendations(state)).toEqual([
      { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Match' }
    ])
  })
})
