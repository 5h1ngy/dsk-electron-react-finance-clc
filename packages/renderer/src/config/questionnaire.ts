import rawSchema from '@renderer/config/questionnaire.json'
import {
  normalizeSchema,
  questionnaireSchema,
  type QuestionnaireSchema
} from '@engines/questionnaire'

export const loadQuestionnaireSchema = (): QuestionnaireSchema => {
  const parsed = questionnaireSchema.parse(rawSchema)
  return normalizeSchema(parsed)
}

