import {
  questionnaireReducer,
  setResponse,
  applyBulkResponses,
  resetQuestionnaire,
  computeQuestionnaireScore
} from './slice'
import { calculateRiskScore } from '@engines/scoring'

jest.mock('@engines/scoring', () => ({
  calculateRiskScore: jest.fn(() => ({
    score: 70,
    riskClass: 'Prudente',
    volatilityBand: 'Medio',
    missingAnswers: [],
    rationales: []
  }))
}))

describe('questionnaire slice', () => {
  it('updates responses individually and clears score', () => {
    const state = questionnaireReducer(
      { schemaStatus: 'ready', responses: { q1: 1 } },
      setResponse({ questionId: 'q2', value: 'yes' })
    )
    expect(state.responses).toEqual({ q1: 1, q2: 'yes' })
    expect(state.score).toBeUndefined()
  })

  it('applies bulk responses skipping undefined values', () => {
    const state = questionnaireReducer(
      { schemaStatus: 'ready', responses: {} },
      applyBulkResponses({ q1: undefined, q2: 10 } as any)
    )
    expect(state.responses).toEqual({ q2: 10 })
  })

  it('computes score only when schema is present', () => {
    const baseState = {
      schemaStatus: 'ready',
      responses: {},
      schema: { sections: [], schemaVersion: '1', title: 'Schema' }
    }
    const state = questionnaireReducer(baseState as any, computeQuestionnaireScore())
    expect(calculateRiskScore).toHaveBeenCalled()
    expect(state.score?.riskClass).toBe('Prudente')
  })

  it('resets questionnaire state', () => {
    const state = questionnaireReducer(
      {
        schemaStatus: 'ready',
        responses: { q1: 1 },
        score: { score: 10, riskClass: 'Prudente', volatilityBand: 'Medio', missingAnswers: [], rationales: [] },
        lastCalculatedAt: 'yesterday'
      } as any,
      resetQuestionnaire()
    )
    expect(state.responses).toEqual({})
    expect(state.score).toBeUndefined()
    expect(state.lastCalculatedAt).toBeUndefined()
  })
})
