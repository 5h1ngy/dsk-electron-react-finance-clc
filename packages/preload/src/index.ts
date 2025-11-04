import { contextBridge } from 'electron'
import { healthApi } from '@preload/api/health'
import { reportApi } from '@preload/api/report'
import type { EnvironmentApi, PreloadApi } from '@preload/types'
import { env } from '@main/config/env'

debugger;
const api: PreloadApi = Object.freeze({
  health: healthApi,
  report: reportApi,
  environment: {
    appVersion: env.appVersion,
    enableDevtools: env.enableDevtools
  }
})

console.info('[Preload] Environment exposed to renderer', {
  appVersion: env.appVersion,
  enableDevtools: env.enableDevtools
})

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('environment', api.environment)
  } catch (error) {
    console.error('Failed to expose preload API', error)
  }
} else {
  const legacyWindow = window as unknown as {
    api: PreloadApi
    environment: EnvironmentApi
  }
  legacyWindow.api = api
  legacyWindow.environment = api.environment
}
