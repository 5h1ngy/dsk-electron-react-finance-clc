import { contextBridge } from 'electron'
import { healthApi } from '@preload/api/health'
import { reportApi } from '@preload/api/report'
import type { PreloadApi } from '@preload/types'
import { env } from '@main/config/env'

const api: PreloadApi = Object.freeze({
  health: healthApi,
  report: reportApi,
  environment: {
    appVersion: env.appVersion,
    enableDevtools: env.enableDevtools
  }
})

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose preload API', error)
  }
} else {
  ;(window as unknown as { api: PreloadApi }).api = api
}
