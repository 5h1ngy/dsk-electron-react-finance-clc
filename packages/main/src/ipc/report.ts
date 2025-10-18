import { dialog, ipcMain } from 'electron'
import { writeFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'

import { logger } from '@main/config/logger'

export interface ReportExportPayload {
  base64: string
  suggestedName: string
}

export interface ReportExportResponse {
  ok: boolean
  cancelled?: boolean
  message?: string
}

const CHANNEL = 'report:export'

export const registerReportIpc = (): void => {
  ipcMain.handle(CHANNEL, async (_event, payload: ReportExportPayload): Promise<ReportExportResponse> => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Esporta PDF rischio',
        defaultPath: payload.suggestedName,
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
      })

      if (canceled || !filePath) {
        return { ok: true, cancelled: true }
      }

      const buffer = Buffer.from(payload.base64, 'base64')
      await writeFile(filePath, buffer)
      logger.success(`PDF esportato in ${filePath}`, 'Report')
      return { ok: true }
    } catch (error) {
      logger.error('Esportazione PDF fallita', 'Report', error)
      const message = error instanceof Error ? error.message : 'Errore sconosciuto'
      return { ok: false, message }
    }
  })
}
