import { app, BrowserWindow } from 'electron'

import { logger } from '@main/config/logger'
import { env } from '@main/config/env'
import { registerSecurityHooks } from '@main/services/security'
import { registerHealthIpc } from '@main/ipc/health'
import { registerReportIpc } from '@main/ipc/report'
import { mainWindowManager, MainWindowManager } from '@main/windowManager'
import { loadReduxDevtoolsExtension } from '@main/extensions/devtools'

export interface MainProcessDependencies {
  appRef: typeof app
  logger: typeof logger
  windowManager: MainWindowManager
  registerSecurityHooks: () => void
  registerHealthIpc: () => void
  registerReportIpc: () => void
}

export class MainProcessApplication {
  private mainWindow: BrowserWindow | null = null

  constructor(private readonly deps: MainProcessDependencies) {}

  bootstrap(): void {
    this.enforceSingleInstance()
    this.registerProcessEvents()
    this.registerAppEvents()
  }

  private enforceSingleInstance(): void {
    const gotLock = this.deps.appRef.requestSingleInstanceLock()
    if (gotLock) {
      return
    }
    this.deps.logger.warn(
      'Second application instance detected. Quitting current launch.',
      'Bootstrap'
    )
    this.deps.appRef.quit()
    process.exit(0)
  }

  private registerProcessEvents(): void {
    process.on('uncaughtException', (error) => {
      this.deps.logger.error('Uncaught exception', 'Process', error)
    })

    process.on('unhandledRejection', (reason) => {
      this.deps.logger.error('Unhandled promise rejection', 'Process', reason)
    })
  }

  private registerAppEvents(): void {
    this.deps.appRef.disableHardwareAcceleration()
    this.deps.logger.debug('Hardware acceleration disabled', 'Bootstrap')

    this.deps.appRef.on('second-instance', () => this.focusExistingWindow())
    this.deps.appRef.on('window-all-closed', () => this.handleAllWindowsClosed())

    this.deps.appRef
      .whenReady()
      .then(() => this.onReady())
      .catch((error) => {
        this.deps.logger.error('Failed to start application', 'Bootstrap', error)
        this.deps.appRef.quit()
      })
  }

  private async onReady(): Promise<void> {
    this.deps.logger.info('Application ready. Applying security hardening.', 'Bootstrap')
    this.deps.registerSecurityHooks()
    this.deps.registerHealthIpc()
    this.deps.registerReportIpc()
    await loadReduxDevtoolsExtension()

    this.mainWindow = await this.deps.windowManager.createMainWindow()
    this.deps.logger.success('Main window created', 'Window')

    this.mainWindow.on('closed', () => {
      this.deps.logger.info('Main window closed', 'Window')
      this.mainWindow = null
    })
  }

  private focusExistingWindow(): void {
    this.deps.logger.warn('Second instance requested focus', 'Bootstrap')
    if (!this.mainWindow) {
      return
    }
    if (this.mainWindow.isMinimized()) {
      this.deps.logger.info('Restoring minimized window', 'Bootstrap')
      this.mainWindow.restore()
    }
    this.mainWindow.focus()
  }

  private handleAllWindowsClosed(): void {
    if (process.platform !== 'darwin') {
      this.deps.logger.info('All windows closed. Quitting application.', 'Lifecycle')
      this.deps.appRef.quit()
    }
  }
}

const application = new MainProcessApplication({
  appRef: app,
  logger,
  windowManager: mainWindowManager,
  registerSecurityHooks,
  registerHealthIpc,
  registerReportIpc
})

if (process.env.NODE_ENV !== 'test') {
  logger.info(`Starting DSK Finance CLC v${env.appVersion}`, 'Bootstrap')
  if (env.enableDevtools) {
    logger.debug('Developer tools are enabled for this session', 'Bootstrap')
  } else {
    logger.debug('Developer tools are disabled for this session', 'Bootstrap')
  }
  application.bootstrap()
}
