import { createAppStore, store } from './index'

describe('renderer store entrypoint', () => {
  it('creates store instances on demand', () => {
    const customStore = createAppStore()
    expect(customStore.getState()).toHaveProperty('workspace')
    expect(store).not.toBe(customStore)
  })
})
