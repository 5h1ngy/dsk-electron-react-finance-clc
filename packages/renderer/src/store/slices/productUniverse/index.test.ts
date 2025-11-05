import * as productUniverse from './index'

describe('productUniverse index', () => {
  it('bundles actions, types and selectors', () => {
    expect(productUniverse.setProductUniverse).toBeDefined()
    expect(productUniverse.selectProducts).toBeInstanceOf(Function)
  })
})
