import * as types from './types'

describe('store types', () => {
  it('exposes compile-time helpers without runtime exports', () => {
    expect(types).toBeDefined()
  })
})

