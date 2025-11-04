import * as types from './types'

describe('preload API types', () => {
  it('load without runtime exports', () => {
    expect(types).toBeDefined()
    expect(Object.keys(types)).toHaveLength(0)
  })
})
