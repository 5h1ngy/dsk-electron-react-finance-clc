import * as types from './types'

describe('scoring types', () => {
  it('exposes the RiskScoreResult contract for runtime imports', () => {
    expect(types).toBeDefined()
    expect(Object.keys(types)).toHaveLength(0)
  })
})
