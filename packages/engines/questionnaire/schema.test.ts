import { loadQuestionnaireSchema } from '@renderer/config/questionnaire';

describe('questionnaire schema loader', () => {
  it('parses sections and questions', () => {
    const schema = loadQuestionnaireSchema()
    expect(schema.sections.length).toBeGreaterThan(0)
    expect(schema.sections[0].questions.length).toBeGreaterThan(0)
  })
})

