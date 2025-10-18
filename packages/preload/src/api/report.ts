import type { ReportExportPayload, ReportExportResponse } from '@main/ipc/report'
import { invokeIpc } from '@preload/api/shared'

const CHANNEL = 'report:export'

export const reportApi = {
  exportPdf: async (payload: ReportExportPayload) =>
    await invokeIpc<ReportExportResponse>(CHANNEL, payload)
}
