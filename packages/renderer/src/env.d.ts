/// <reference types="vite/client" />

import type { PreloadApi } from '@preload/types'

declare global {
  interface Window {
    api: PreloadApi
  }
}

export {}

declare module 'pdfjs-dist/build/pdf.worker?url' {
  const workerSrc: string
  export default workerSrc
}
