import { loadQuestionnaireSchema } from './questionnaire'

describe('loadQuestionnaireSchema', () => {
  it('parses and normalizes the static JSON schema', () => {
    const schema = loadQuestionnaireSchema()
    expect(schema.schemaVersion).toBeDefined()
    expect(schema.sections.length).toBeGreaterThan(0)
  })
})
