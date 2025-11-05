import type { EnvironmentApi, PreloadApi } from '@preload/types'

declare global {
  interface Window {
    api: PreloadApi
    environment: EnvironmentApi
  }
}

export {}
