import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '@renderer/store/types'

const selectWorkspaceState = (state: RootState) => state.workspace

export const selectRequestImport = createSelector(
  selectWorkspaceState,
  (state) => state.requestImport
)

export const selectFinanceImport = createSelector(
  selectWorkspaceState,
  (state) => state.financeImport
)
