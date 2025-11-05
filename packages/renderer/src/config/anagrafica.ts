import rawSchema from '@renderer/config/anagrafica.json'
import {
  normalizeSchema,
  questionnaireSchema,
  type QuestionnaireSchema
} from '@engines/questionnaire'

export const loadAnagraficaSchema = (): QuestionnaireSchema => {
  const parsed = questionnaireSchema.parse(rawSchema)
  return normalizeSchema(parsed)
}
