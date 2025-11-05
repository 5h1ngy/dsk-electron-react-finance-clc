import { app, ipcMain } from 'electron'

export interface HealthSnapshot {
  status: 'healthy'
  version: string
  timestamp: string
  uptimeSeconds: number
}

export type HealthResponse =
  | { ok: true; data: HealthSnapshot }
  | { ok: false; code: string; message: string }

export const HEALTH_CHANNEL = 'system:health'

export const registerHealthIpc = (): void => {
  ipcMain.handle(HEALTH_CHANNEL, (): HealthResponse => {
    try {
      return {
        ok: true,
        data: {
          status: 'healthy',
          version: app.getVersion(),
          timestamp: new Date().toISOString(),
          uptimeSeconds: process.uptime()
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { ok: false, code: 'ERR_INTERNAL', message }
    }
  })
}
