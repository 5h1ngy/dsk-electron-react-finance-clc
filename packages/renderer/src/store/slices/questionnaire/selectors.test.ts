import {
  selectQuestionnaireSchema,
  selectQuestionnaireStatus,
  selectResponses,
  selectQuestionnaireScore,
  selectScoreMeta,
  selectAnsweredProgress
} from './selectors'
import type { QuestionnaireSchema, QuestionnaireResponses } from '@engines/questionnaire'
import type { RiskScoreResult } from '@engines/scoring'
import type { RootState } from '@renderer/store/types'

const schema: QuestionnaireSchema = {
  schemaVersion: '1',
  title: 'Schema',
  sections: [
    {
      id: 's1',
      label: 'Section',
      questions: [
        { id: 'q1', label: 'Q1', type: 'number', required: true, weight: 1 },
        { id: 'q2', label: 'Q2', type: 'number', required: true, weight: 1 }
      ]
    }
  ]
}

const responses: QuestionnaireResponses = { q1: 1 }
const score: RiskScoreResult = {
  score: 70,
  riskClass: 'Prudente',
  volatilityBand: 'Media',
  missingAnswers: [],
  rationales: []
}

const buildState = (): RootState => ({
  questionnaire: {
    schema,
    schemaStatus: 'ready',
    responses,
    score,
    lastCalculatedAt: 'now'
  },
  workspace: undefined as never,
  productUniverse: undefined as never
})

describe('questionnaire selectors', () => {
  it('selects primitive slices', () => {
    const state = buildState()
    expect(selectQuestionnaireSchema(state)).toBe(schema)
    expect(selectQuestionnaireStatus(state)).toBe('ready')
    expect(selectResponses(state)).toEqual(responses)
    expect(selectQuestionnaireScore(state)).toEqual(score)
    expect(selectScoreMeta(state)).toEqual({ lastCalculatedAt: 'now' })
  })

  it('computes answered progress for required questions', () => {
    const state = buildState()
    expect(selectAnsweredProgress(state)).toEqual({ completed: 50, required: 2 })
  })
})
