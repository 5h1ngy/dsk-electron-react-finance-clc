import type { HealthResponse } from '@main/ipc/health'
import type { ReportExportPayload, ReportExportResponse } from '@main/ipc/report'

export interface IpcSuccess<T> {
  ok: true
  data: T
}

export interface IpcError {
  ok: false
  code: string
  message: string
}

export type IpcResponse<T> = IpcSuccess<T> | IpcError

export interface HealthApi {
  check: () => Promise<HealthResponse>
}

export interface ReportApi {
  exportPdf: (payload: ReportExportPayload) => Promise<IpcResponse<ReportExportResponse>>
}

export interface PreloadApi {
  health: HealthApi
  report: ReportApi
}
