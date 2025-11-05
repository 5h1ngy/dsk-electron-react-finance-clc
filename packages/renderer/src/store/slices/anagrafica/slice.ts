import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  QuestionnaireResponseValue,
  QuestionnaireResponses,
  QuestionnaireSchema
} from '@engines/questionnaire'
import { loadAnagraficaSchema } from '@renderer/config/anagrafica'
import type { AnagraficaState } from '@renderer/store/slices/anagrafica/types'

const initialState: AnagraficaState = {
  schemaStatus: 'idle',
  responses: {}
}

export const initializeAnagrafica = createAsyncThunk<QuestionnaireSchema>(
  'anagrafica/initialize',
  async () => loadAnagraficaSchema()
)

const anagraficaSlice = createSlice({
  name: 'anagrafica',
  initialState,
  reducers: {
    setAnagraficaResponse: (
      state,
      action: PayloadAction<{ questionId: string; value: QuestionnaireResponseValue }>
    ) => {
      state.responses[action.payload.questionId] = action.payload.value
      state.lastUpdatedAt = new Date().toISOString()
    },
    applyAnagraficaResponses: (state, action: PayloadAction<QuestionnaireResponses>) => {
      const sanitizedEntries = Object.entries(action.payload).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
      const merged = Object.fromEntries(sanitizedEntries)
      state.responses = {
        ...state.responses,
        ...merged
      }
      if (sanitizedEntries.length > 0) {
        state.lastUpdatedAt = new Date().toISOString()
      }
    },
    resetAnagrafica: (state) => {
      state.responses = {}
      state.lastUpdatedAt = undefined
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAnagrafica.pending, (state) => {
        state.schemaStatus = 'loading'
        state.error = undefined
      })
      .addCase(initializeAnagrafica.fulfilled, (state, action) => {
        state.schemaStatus = 'ready'
        state.schema = action.payload
      })
      .addCase(initializeAnagrafica.rejected, (state, action) => {
        state.schemaStatus = 'error'
        state.error = action.error.message ?? 'Impossibile caricare i dati anagrafici'
      })
  }
})

export const { setAnagraficaResponse, applyAnagraficaResponses, resetAnagrafica } =
  anagraficaSlice.actions
export const anagraficaReducer = anagraficaSlice.reducer
