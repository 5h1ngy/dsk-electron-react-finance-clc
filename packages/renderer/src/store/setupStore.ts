import { configureStore } from '@reduxjs/toolkit'

import { questionnaireReducer } from '@renderer/store/slices/questionnaire'
import { workspaceReducer } from '@renderer/store/slices/workspace'
import { productUniverseReducer } from '@renderer/store/slices/productUniverse'

export const setupStore = () =>
  configureStore({
    reducer: {
      questionnaire: questionnaireReducer,
      workspace: workspaceReducer,
      productUniverse: productUniverseReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })
