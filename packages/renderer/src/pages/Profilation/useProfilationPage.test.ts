import { useProfilationPage } from './useProfilationPage'

describe('useProfilationPage', () => {
  it('returns a stable empty object', () => {
    expect(useProfilationPage()).toEqual({})
  })
})
