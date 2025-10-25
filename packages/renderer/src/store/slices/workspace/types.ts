export interface RequestImportMeta {
  fileName: string
  importedAt: string
  responses: number
}

export interface FinanceImportMeta {
  fileName: string
  importedAt: string
  instruments: number
  categories: Array<{ name: string; count: number }>
}

export interface PdfImportMeta {
  fileName: string
  importedAt: string
  pages: number
}

import type { CertificateSummary } from '@engines/signature/types'

export interface ReportExportMeta {
  fileName: string
  exportedAt: string
  sha256?: string
  manifestPath?: string
  certificateSubject?: string
  hashPath?: string
}

export interface CertificateMeta {
  fileName: string
  loadedAt: string
  base64: string
  summary?: CertificateSummary
}

export interface WorkspaceState {
  requestImport?: RequestImportMeta
  financeImport?: FinanceImportMeta
  pdfImport?: PdfImportMeta
  reportExport?: ReportExportMeta
  certificate?: CertificateMeta
}
