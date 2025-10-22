import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  FinanceImportMeta,
  CertificateMeta,
  PdfImportMeta,
  ReportExportMeta,
  RequestImportMeta,
  WorkspaceState
} from '@renderer/store/slices/workspace/types'

const initialState: WorkspaceState = {}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setRequestImport: (state, action: PayloadAction<RequestImportMeta | undefined>) => {
      state.requestImport = action.payload
    },
    setFinanceImport: (state, action: PayloadAction<FinanceImportMeta | undefined>) => {
      state.financeImport = action.payload
    },
    setPdfImport: (state, action: PayloadAction<PdfImportMeta | undefined>) => {
      state.pdfImport = action.payload
    },
    setReportExport: (state, action: PayloadAction<ReportExportMeta | undefined>) => {
      state.reportExport = action.payload
    },
    setCertificate: (state, action: PayloadAction<CertificateMeta | undefined>) => {
      state.certificate = action.payload
    }
  }
})

export const {
  setRequestImport,
  setFinanceImport,
  setPdfImport,
  setReportExport,
  setCertificate
} = workspaceSlice.actions
export const workspaceReducer = workspaceSlice.reducer
