import { act, renderHook } from '@testing-library/react'

import { useHealthStatus } from './useHealthStatus'

describe('useHealthStatus', () => {
  it('refreshes snapshot via the preload API', async () => {
    const snapshot = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'ok',
      uptimeSeconds: 10
    }
    window.api.health.check = jest.fn().mockResolvedValue({ ok: true, data: snapshot })

    const { result } = renderHook(() => useHealthStatus())
    await act(async () => {
      await result.current.refresh()
    })
    expect(result.current.snapshot).toEqual(snapshot)
  })

  it('stores an error message when the API fails', async () => {
    window.api.health.check = jest.fn().mockRejectedValue(new Error('Boom'))

    const { result } = renderHook(() => useHealthStatus())
    await act(async () => {
      await result.current.refresh()
    })
    expect(result.current.error).toBe('Boom')
  })
})
