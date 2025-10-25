import { useWorkbenchPage } from './hooks'

describe('useWorkbenchPage', () => {
  it('returns a stable empty object', () => {
    expect(useWorkbenchPage()).toEqual({})
  })
})
