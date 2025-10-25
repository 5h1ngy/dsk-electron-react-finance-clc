import { configureStore } from '@reduxjs/toolkit'

import { setupStore } from './setupStore'

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit')
  return {
    ...actual,
    configureStore: jest.fn(() => ({
      dispatch: jest.fn(),
      getState: jest.fn()
    }))
  }
})

describe('setupStore', () => {
  it('wires domain reducers with disabled serializable check', () => {
    setupStore()
    expect(configureStore).toHaveBeenCalledWith(
      expect.objectContaining({
        reducer: expect.objectContaining({
          questionnaire: expect.any(Function),
          workspace: expect.any(Function),
          productUniverse: expect.any(Function)
        })
      })
    )
  })
})
