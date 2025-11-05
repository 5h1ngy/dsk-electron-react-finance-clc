import { generateRiskReport } from '@engines/report'
import { loadQuestionnaireSchema } from '@renderer/config/questionnaire'
import { calculateRiskScore } from '@engines/scoring'
import type { QuestionnaireResponses } from '@engines/questionnaire'

describe('generateRiskReport', () => {
  it('returns a pdf document buffer', async () => {
    const schema = loadQuestionnaireSchema()
    const responses = schema.sections.reduce<QuestionnaireResponses>((acc, section) => {
      section.questions.forEach((question) => {
        acc[question.id] =
          question.type === 'single_choice' && question.options?.[0] ? question.options[0] : 1
      })
      return acc
    }, {})
    const score = calculateRiskScore(schema, responses)
    const pdfBytes = await generateRiskReport({
      questionnaire: { schema, responses, score }
    })
    expect(pdfBytes.length).toBeGreaterThan(100)
  })
})
