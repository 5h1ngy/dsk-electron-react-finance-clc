import {
  selectQuestionnaireSchema,
  selectQuestionnaireStatus,
  selectResponses,
  selectQuestionnaireScore,
  selectScoreMeta,
  selectAnsweredProgress
} from './selectors'

const schema = {
  sections: [
    {
      id: 's1',
      label: 'Section',
      questions: [
        { id: 'q1', required: true },
        { id: 'q2', required: true }
      ]
    }
  ]
}

const state = {
  questionnaire: {
    schema,
    schemaStatus: 'ready',
    responses: { q1: 1 },
    score: { score: 70 },
    lastCalculatedAt: 'now'
  }
} as any

describe('questionnaire selectors', () => {
  it('selects primitive slices', () => {
    expect(selectQuestionnaireSchema(state)).toBe(schema)
    expect(selectQuestionnaireStatus(state)).toBe('ready')
    expect(selectResponses(state)).toEqual({ q1: 1 })
    expect(selectQuestionnaireScore(state)).toEqual({ score: 70 })
    expect(selectScoreMeta(state)).toEqual({ lastCalculatedAt: 'now' })
  })

  it('computes answered progress for required questions', () => {
    expect(selectAnsweredProgress(state)).toEqual({ completed: 50, required: 2 })
  })
})
