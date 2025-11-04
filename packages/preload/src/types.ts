import type { HealthResponse } from '@main/ipc/health'
import type { ReportExportPayload, ReportExportResponse } from '@main/ipc/report'

export interface HealthApi {
  check: () => Promise<HealthResponse>
}

export interface ReportApi {
  exportPdf: (payload: ReportExportPayload) => Promise<ReportExportResponse>
}

export interface PreloadApi {
  health: HealthApi
  report: ReportApi
}
