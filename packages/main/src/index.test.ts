import type { BrowserWindow } from 'electron'

import { MainProcessApplication, type MainProcessDependencies } from './index'

const createWindow = (): BrowserWindow =>
  ({
    on: jest.fn(),
    isMinimized: jest.fn().mockReturnValue(false),
    restore: jest.fn(),
    focus: jest.fn()
  }) as unknown as BrowserWindow

const createDeps = (overrides: Partial<MainProcessDependencies> = {}): MainProcessDependencies => {
  const window = createWindow()
  return {
    appRef: {
      requestSingleInstanceLock: jest.fn().mockReturnValue(true),
      quit: jest.fn(),
      disableHardwareAcceleration: jest.fn(),
      on: jest.fn(),
      whenReady: jest.fn().mockResolvedValue(undefined)
    } as unknown as MainProcessDependencies['appRef'],
    logger: {
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      debug: jest.fn(),
      renderer: jest.fn()
    } as MainProcessDependencies['logger'],
    windowManager: {
      createMainWindow: jest.fn().mockResolvedValue(window)
    } as unknown as MainProcessDependencies['windowManager'],
    registerSecurityHooks: jest.fn(),
    registerHealthIpc: jest.fn(),
    registerReportIpc: jest.fn(),
    ...overrides
  }
}

const flushMicrotasks = () => new Promise((resolve) => setImmediate(resolve))

describe('MainProcessApplication', () => {
  it('quits the process when another instance already holds the lock', () => {
    const base = createDeps()
    const deps: MainProcessDependencies = {
      ...base,
      appRef: {
        ...base.appRef,
        requestSingleInstanceLock: jest.fn().mockReturnValue(false),
        quit: jest.fn()
      }
    }
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const app = new MainProcessApplication(deps)

    app.bootstrap()

    expect(deps.appRef.quit).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalledWith(0)
    exitSpy.mockRestore()
  })

  it('registers IPC hooks and creates the main window on ready', async () => {
    const deps = createDeps()
    const app = new MainProcessApplication(deps)

    app.bootstrap()
    await flushMicrotasks()

    expect(deps.registerSecurityHooks).toHaveBeenCalled()
    expect(deps.registerHealthIpc).toHaveBeenCalled()
    expect(deps.registerReportIpc).toHaveBeenCalled()
    expect(deps.windowManager.createMainWindow).toHaveBeenCalled()
    expect(deps.appRef.on).toHaveBeenCalledWith('second-instance', expect.any(Function))
    expect(deps.appRef.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function))
  })
})
