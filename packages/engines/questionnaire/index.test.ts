import * as questionnaire from './index'

describe('questionnaire index', () => {
  it('re-exports schema helpers', () => {
    expect(questionnaire.questionnaireSchema).toBeDefined()
    expect(questionnaire.normalizeSchema).toBeInstanceOf(Function)
  })
})
