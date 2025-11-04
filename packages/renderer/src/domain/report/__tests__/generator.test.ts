import { generateRiskReport } from '@renderer/domain/report'
import { loadQuestionnaireSchema } from '@renderer/data/questionnaire'
import { calculateRiskScore } from '@renderer/domain/scoring'

describe('generateRiskReport', () => {
  it('returns a pdf document buffer', async () => {
    const schema = loadQuestionnaireSchema()
    const responses = schema.sections.reduce<Record<string, unknown>>((acc, section) => {
      section.questions.forEach((question) => {
        acc[question.id] = question.type === 'single_choice' && question.options?.[0] ? question.options[0] : 1
      })
      return acc
    }, {})
    const score = calculateRiskScore(schema, responses)
    const pdfBytes = await generateRiskReport({ schema, responses, score })
    expect(pdfBytes.length).toBeGreaterThan(100)
  })
})
