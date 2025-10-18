import { configureStore } from '@reduxjs/toolkit'

import { questionnaireReducer } from '@renderer/store/slices/questionnaire'
import { workspaceReducer } from '@renderer/store/slices/workspace'

export const setupStore = () =>
  configureStore({
    reducer: {
      questionnaire: questionnaireReducer,
      workspace: workspaceReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })
