import rawSchema from '../../data/requests_schema.json'
import {
  normalizeSchema,
  questionnaireSchema,
  type QuestionnaireSchema
} from '@renderer/domain/questionnaire'

export const loadQuestionnaireSchema = (): QuestionnaireSchema => {
  const parsed = questionnaireSchema.parse(rawSchema)
  return normalizeSchema(parsed)
}
