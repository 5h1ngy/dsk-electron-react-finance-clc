import {
  selectProducts,
  selectProductCategories,
  selectRecommendations
} from './selectors'

const state = {
  productUniverse: {
    products: ['p1'],
    categories: ['c1'],
    recommendations: ['r1']
  }
} as any

describe('productUniverse selectors', () => {
  it('selects memoized fields from the slice', () => {
    expect(selectProducts(state)).toEqual(['p1'])
    expect(selectProductCategories(state)).toEqual(['c1'])
    expect(selectRecommendations(state)).toEqual(['r1'])
  })
})
