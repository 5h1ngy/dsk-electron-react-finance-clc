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

export interface WorkspaceState {
  requestImport?: RequestImportMeta
  financeImport?: FinanceImportMeta
}
