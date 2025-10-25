import type { BrowserWindow } from 'electron'

import { MainWindowManager, MAIN_WINDOW_OPTIONS } from './windowManager'

const createBrowserWindowStub = () => {
  const webContents = {
    on: jest.fn(),
    once: jest.fn(),
    isDevToolsOpened: jest.fn().mockReturnValue(false),
    openDevTools: jest.fn()
  }
  const instance = {
    on: jest.fn(),
    show: jest.fn(),
    destroy: jest.fn(),
    loadURL: jest.fn(),
    loadFile: jest.fn(),
    webContents
  }
  const ctor = jest.fn(() => instance)
  return { ctor, instance }
}

const createLogger = () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  debug: jest.fn(),
  renderer: jest.fn()
})

describe('MainWindowManager', () => {
  it('creates a BrowserWindow with the expected options', async () => {
    const { ctor, instance } = createBrowserWindowStub()
    const logger = createLogger()
    const manager = new MainWindowManager({
      browserWindowCtor: ctor as unknown as typeof BrowserWindow,
      logger
    })

    const window = await manager.createMainWindow()

    expect(window).toBe(instance)
    expect(ctor).toHaveBeenCalledWith(MAIN_WINDOW_OPTIONS)
    expect(instance.webContents.on).toHaveBeenCalledWith(
      'console-message',
      expect.any(Function)
    )
    expect(logger.info).toHaveBeenCalledWith('Main window instantiated', 'Window')
  })

  it('loads renderer from dev server when running in dev mode', async () => {
    const { ctor, instance } = createBrowserWindowStub()
    const logger = createLogger()
    const manager = new MainWindowManager({
      browserWindowCtor: ctor as unknown as typeof BrowserWindow,
      logger,
      isDev: () => true,
      env: { ELECTRON_RENDERER_URL: 'http://localhost:5173' } as NodeJS.ProcessEnv
    })

    await manager.createMainWindow()

    expect(instance.loadURL).toHaveBeenCalledWith('http://localhost:5173')
    expect(instance.loadFile).not.toHaveBeenCalled()
    const [, handler] = instance.webContents.once.mock.calls.find(
      ([channel]) => channel === 'dom-ready'
    ) ?? []
    expect(handler).toBeDefined()
    handler?.()
    expect(instance.webContents.openDevTools).toHaveBeenCalled()
  })

  it('forwards console messages unless suppressed', async () => {
    const { ctor, instance } = createBrowserWindowStub()
    const logger = createLogger()
    const preventDefault = jest.fn()
    const manager = new MainWindowManager({
      browserWindowCtor: ctor as unknown as typeof BrowserWindow,
      logger,
      shouldSuppress: (source, message) => source.includes('devtools') || message.includes('ignore')
    })

    await manager.createMainWindow()
    const [, handler] = instance.webContents.on.mock.calls.find(
      ([channel]) => channel === 'console-message'
    ) ?? []
    handler?.({ preventDefault } as { preventDefault: () => void }, 1, 'hello', 10, 'bundle.js')
    expect(logger.renderer).toHaveBeenCalledWith(1, 'hello', 'bundle.js', 10)

    handler?.({ preventDefault } as { preventDefault: () => void }, 1, 'ignore this', 10, 'bundle.js')
    expect(preventDefault).toHaveBeenCalled()
  })
})
