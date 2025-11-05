import { dialog, ipcMain } from 'electron'
import { writeFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { basename, join, parse } from 'node:path'

import { logger } from '@main/config/logger'
import {
  signReport,
  type ReportManifest,
  type ReportMetadataPayload
} from '@main/services/signature'

interface CertificatePayload {
  base64: string
  password: string
  fileName: string
}

export interface ReportExportPayload {
  pdfBase64: string
  suggestedName: string
  certificate?: CertificatePayload
  metadata: ReportMetadataPayload
  includeManifest?: boolean
  includeHashFile?: boolean
  skipSignature?: boolean
}

export interface ReportExportResponse {
  ok: boolean
  cancelled?: boolean
  message?: string
  sha256?: string
  manifestPath?: string
  hashPath?: string
  savedAt?: string
}

const CHANNEL = 'report:export'

const deriveSiblingPath = (filePath: string, suffix: string): string => {
  const parsed = parse(filePath)
  return join(parsed.dir, `${parsed.name}${suffix}`)
}

const writeHashFile = async (filePath: string, originalFileName: string, hash: string) => {
  const content = `SHA256(${originalFileName})=${hash}`
  await writeFile(filePath, content, { encoding: 'utf-8' })
}

const writeManifestFile = async (filePath: string, manifest: ReportManifest) => {
  const payload = JSON.stringify(manifest, null, 2)
  await writeFile(filePath, payload, { encoding: 'utf-8' })
}

export const registerReportIpc = (): void => {
  ipcMain.handle(
    CHANNEL,
    async (_event, payload: ReportExportPayload): Promise<ReportExportResponse> => {
      try {
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'Esporta PDF rischio',
          defaultPath: payload.suggestedName,
          filters: [{ name: 'PDF', extensions: ['pdf'] }]
        })

        if (canceled || !filePath) {
          return { ok: true, cancelled: true }
        }

        const pdfBuffer = Buffer.from(payload.pdfBase64, 'base64')

        if (payload.skipSignature) {
          await writeFile(filePath, pdfBuffer)
          logger.success(`PDF esportato senza firma in ${filePath}`, 'Report')
          return {
            ok: true,
            savedAt: new Date().toISOString()
          }
        }

        if (!payload.certificate?.base64 || !payload.certificate.password) {
          return { ok: false, message: 'Certificato P12 non fornito.' }
        }

        const { pdf, hash, manifest } = signReport({
          pdfBuffer,
          certificateBase64: payload.certificate.base64,
          certificatePassword: payload.certificate.password,
          metadata: payload.metadata
        })

        await writeFile(filePath, pdf)

        let hashPath: string | undefined
        let manifestPath: string | undefined

        if (payload.includeHashFile) {
          hashPath = deriveSiblingPath(filePath, '.sha256.txt')
          await writeHashFile(hashPath, basename(filePath), hash)
        }

        if (payload.includeManifest) {
          manifestPath = deriveSiblingPath(filePath, '.manifest.json')
          await writeManifestFile(manifestPath, manifest)
        }

        logger.success(`PDF firmato esportato in ${filePath}`, 'Report')
        return {
          ok: true,
          sha256: hash,
          manifestPath,
          hashPath,
          savedAt: new Date().toISOString()
        }
      } catch (error) {
        logger.error('Esportazione PDF fallita', 'Report', error)
        const message = error instanceof Error ? error.message : 'Errore sconosciuto'
        return { ok: false, message }
      }
    }
  )
}
