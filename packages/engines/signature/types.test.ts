import * as types from './types'

describe('signature types', () => {
  it('loads without emitting runtime values', () => {
    expect(types).toBeDefined()
    expect(Object.keys(types)).toHaveLength(0)
  })
})
