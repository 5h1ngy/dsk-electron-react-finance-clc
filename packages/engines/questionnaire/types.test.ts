import * as types from './types'

describe('questionnaire types module', () => {
  it('is a type-only module that still loads at runtime', () => {
    expect(types).toBeDefined()
    expect(Object.keys(types)).toHaveLength(0)
  })
})
