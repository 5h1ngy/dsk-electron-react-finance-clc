import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { calculateRiskScore } from '@engines/scoring'
import type {
  QuestionnaireResponseValue,
  QuestionnaireResponses,
  QuestionnaireSchema
} from '@engines/questionnaire'
import { loadQuestionnaireSchema } from '@renderer/config/questionnaire'
import type { QuestionnaireState } from '@renderer/store/slices/questionnaire/types'

const initialState: QuestionnaireState = {
  schemaStatus: 'idle',
  responses: {}
}

export const initializeQuestionnaire = createAsyncThunk<QuestionnaireSchema>(
  'questionnaire/initialize',
  async () => loadQuestionnaireSchema()
)

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    setResponse: (
      state,
      action: PayloadAction<{ questionId: string; value: QuestionnaireResponseValue }>
    ) => {
      state.responses[action.payload.questionId] = action.payload.value
      state.score = undefined
    },
    applyBulkResponses: (state, action: PayloadAction<QuestionnaireResponses>) => {
      const sanitizedEntries = Object.entries(action.payload).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
      const merged = Object.fromEntries(sanitizedEntries)
      state.responses = {
        ...state.responses,
        ...merged
      }
      state.score = undefined
    },
    resetQuestionnaire: (state) => {
      state.responses = {}
      state.score = undefined
      state.lastCalculatedAt = undefined
    },
    computeQuestionnaireScore: (state) => {
      if (!state.schema) {
        return
      }
      state.score = calculateRiskScore(state.schema, state.responses)
      state.lastCalculatedAt = new Date().toISOString()
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeQuestionnaire.pending, (state) => {
        state.schemaStatus = 'loading'
        state.error = undefined
      })
      .addCase(initializeQuestionnaire.fulfilled, (state, action) => {
        state.schemaStatus = 'ready'
        state.schema = action.payload
      })
      .addCase(initializeQuestionnaire.rejected, (state, action) => {
        state.schemaStatus = 'error'
        state.error = action.error.message ?? 'Impossibile caricare lo schema'
      })
  }
})

export const { setResponse, applyBulkResponses, resetQuestionnaire, computeQuestionnaireScore } =
  questionnaireSlice.actions
export const questionnaireReducer = questionnaireSlice.reducer
