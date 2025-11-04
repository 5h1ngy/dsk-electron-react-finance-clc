import { registerHealthIpc, HEALTH_CHANNEL } from '@main/ipc/health'

jest.mock('electron', () => {
  const handlers = new Map<string, (...args: unknown[]) => unknown>()
  return {
    app: {
      getVersion: jest.fn(() => '1.2.3')
    },
    ipcMain: {
      handle: jest.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
        handlers.set(channel, handler)
      }),
      __handlers: handlers
    }
  }
})

const { ipcMain, app } = jest.requireMock('electron') as {
  ipcMain: { handle: jest.Mock; __handlers: Map<string, (...args: unknown[]) => unknown> }
  app: { getVersion: jest.Mock }
}

describe('registerHealthIpc', () => {
  beforeEach(() => {
    ipcMain.handle.mockClear()
    app.getVersion.mockClear()
    ipcMain.__handlers.clear()
  })

  it('registers a handler that returns the current health snapshot', () => {
    registerHealthIpc()
    expect(ipcMain.handle).toHaveBeenCalledWith(HEALTH_CHANNEL, expect.any(Function))

    const handler = ipcMain.__handlers.get(HEALTH_CHANNEL)!
    const response = handler()

    expect(response).toMatchObject({
      ok: true,
      data: {
        status: 'healthy',
        version: '1.2.3'
      }
    })
  })

  it('returns an error payload when the handler throws', () => {
    app.getVersion.mockImplementationOnce(() => {
      throw new Error('boom')
    })
    registerHealthIpc()

    const handler = ipcMain.__handlers.get(HEALTH_CHANNEL)!
    const response = handler()

    expect(response).toEqual({
      ok: false,
      code: 'ERR_INTERNAL',
      message: 'boom'
    })
  })
})
