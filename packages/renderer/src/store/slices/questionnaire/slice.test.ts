import {
  questionnaireReducer,
  setResponse,
  applyBulkResponses,
  resetQuestionnaire,
  computeQuestionnaireScore
} from './slice'
import { calculateRiskScore } from '@engines/scoring'
import type { QuestionnaireResponses, QuestionnaireSchema } from '@engines/questionnaire'
import type { QuestionnaireState } from './types'
import type { RiskScoreResult } from '@engines/scoring'

jest.mock('@engines/scoring', () => ({
  calculateRiskScore: jest.fn(() => ({
    score: 70,
    riskClass: 'Prudente',
    volatilityBand: 'Media',
    missingAnswers: [],
    rationales: []
  }))
}))

const schema: QuestionnaireSchema = {
  schemaVersion: '1',
  title: 'Schema',
  sections: []
}

const createState = (overrides: Partial<QuestionnaireState> = {}): QuestionnaireState => ({
  schemaStatus: 'ready',
  responses: {},
  schema,
  ...overrides
})

describe('questionnaire slice', () => {
  it('updates responses individually and clears score', () => {
    const initialState = createState({ responses: { q1: 1 } })
    const state = questionnaireReducer(
      initialState,
      setResponse({ questionId: 'q2', value: 'yes' })
    )
    expect(state.responses).toEqual({ q1: 1, q2: 'yes' })
    expect(state.score).toBeUndefined()
  })

  it('applies bulk responses skipping undefined values', () => {
    const payload = { q1: undefined, q2: 10 } as unknown as QuestionnaireResponses
    const state = questionnaireReducer(createState(), applyBulkResponses(payload))
    expect(state.responses).toEqual({ q2: 10 })
  })

  it('computes score only when schema is present', () => {
    const state = questionnaireReducer(createState(), computeQuestionnaireScore())
    expect(calculateRiskScore).toHaveBeenCalled()
    expect(state.score?.riskClass).toBe('Prudente')
  })

  it('resets questionnaire state', () => {
    const score: RiskScoreResult = {
      score: 10,
      riskClass: 'Prudente',
      volatilityBand: 'Media',
      missingAnswers: [],
      rationales: []
    }
    const state = questionnaireReducer(
      createState({ responses: { q1: 1 }, score, lastCalculatedAt: 'yesterday' }),
      resetQuestionnaire()
    )
    expect(state.responses).toEqual({})
    expect(state.score).toBeUndefined()
    expect(state.lastCalculatedAt).toBeUndefined()
  })
})
