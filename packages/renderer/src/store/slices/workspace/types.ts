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

export interface ReportExportMeta {
  fileName: string
  exportedAt: string
}

export interface WorkspaceState {
  requestImport?: RequestImportMeta
  financeImport?: FinanceImportMeta
  pdfImport?: PdfImportMeta
  reportExport?: ReportExportMeta
}
