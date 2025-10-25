const exposeMock = jest.fn()

jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: exposeMock
  }
}))

describe('preload entry point', () => {
  afterEach(() => {
    exposeMock.mockClear()
    jest.resetModules()
  })

  const withContextIsolation = (value: boolean) => {
    ;(process as NodeJS.Process & { contextIsolated?: boolean }).contextIsolated = value
  }

  it('exposes the preload api when context isolation is enabled', async () => {
    withContextIsolation(true)
    const module = await import('@preload/index')
    expect(exposeMock).toHaveBeenCalledWith(
      'api',
      expect.objectContaining({ health: expect.any(Object), report: expect.any(Object) })
    )
    expect(module).toBeDefined()
  })

  it('assigns api on window when context isolation is disabled', async () => {
    withContextIsolation(false)
    const globalWithWindow = global as typeof globalThis & { window?: Record<string, unknown> }
    const originalWindow = globalWithWindow.window
    try {
      globalWithWindow.window = {}
      await import('@preload/index')
      expect(globalWithWindow.window?.api).toEqual(
        expect.objectContaining({ health: expect.any(Object), report: expect.any(Object) })
      )
    } finally {
      globalWithWindow.window = originalWindow
    }
  })
})
