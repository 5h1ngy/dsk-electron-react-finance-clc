import { contextBridge } from 'electron'
import { healthApi } from '@preload/api/health'
import { reportApi } from '@preload/api/report'
import type { EnvironmentApi, PreloadApi } from '@preload/types'

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback
  }
  const normalized = value.trim().toLowerCase()
  if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) {
    return true
  }
  if (['false', '0', 'no', 'n', 'off'].includes(normalized)) {
    return false
  }
  return fallback
}

const appVersion =
  process.env.APP_VERSION?.trim() ||
  process.env.npm_package_version?.trim() ||
  '0.0.0-dev'

const enableDevtools = parseBoolean(
  process.env.ENABLE_DEVTOOLS,
  process.env.NODE_ENV !== 'production'
)

const api: PreloadApi = Object.freeze({
  health: healthApi,
  report: reportApi,
  environment: {
    appVersion,
    enableDevtools
  }
})

console.info('[Preload] Environment exposed to renderer', {
  appVersion,
  enableDevtools
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
