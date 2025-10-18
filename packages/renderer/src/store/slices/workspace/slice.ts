import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { FinanceImportMeta, RequestImportMeta, WorkspaceState } from '@renderer/store/slices/workspace/types'

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
    }
  }
})

export const { setRequestImport, setFinanceImport } = workspaceSlice.actions
export const workspaceReducer = workspaceSlice.reducer
