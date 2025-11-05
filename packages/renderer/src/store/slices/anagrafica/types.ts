import type { QuestionnaireResponses, QuestionnaireSchema } from '@engines/questionnaire'

export interface AnagraficaState {
  schema?: QuestionnaireSchema
  schemaStatus: 'idle' | 'loading' | 'ready' | 'error'
  responses: QuestionnaireResponses
  lastUpdatedAt?: string
  error?: string
}
