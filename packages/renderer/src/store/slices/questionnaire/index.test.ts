import * as questionnaire from './index'

describe('questionnaire index', () => {
  it('exposes reducers and selectors', () => {
    expect(questionnaire.setResponse).toBeDefined()
    expect(questionnaire.selectQuestionnaireSchema).toBeInstanceOf(Function)
  })
})
