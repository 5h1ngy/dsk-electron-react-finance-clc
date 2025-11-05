import { configureStore } from '@reduxjs/toolkit'

import { questionnaireReducer } from '@renderer/store/slices/questionnaire'
import { workspaceReducer } from '@renderer/store/slices/workspace'
import { productUniverseReducer } from '@renderer/store/slices/productUniverse'
import { anagraficaReducer } from '@renderer/store/slices/anagrafica'

export const setupStore = () =>
  configureStore({
    reducer: {
      anagrafica: anagraficaReducer,
      questionnaire: questionnaireReducer,
      workspace: workspaceReducer,
      productUniverse: productUniverseReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })
