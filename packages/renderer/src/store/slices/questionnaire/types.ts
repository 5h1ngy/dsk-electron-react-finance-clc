import type {
  QuestionnaireResponses,
  QuestionnaireSchema,
  QuestionnaireResponseValue
} from '@renderer/domain/questionnaire'
import type { RiskScoreResult } from '@renderer/domain/scoring'

export interface QuestionnaireState {
  schema?: QuestionnaireSchema
  schemaStatus: 'idle' | 'loading' | 'ready' | 'error'
  responses: QuestionnaireResponses
  score?: RiskScoreResult
  lastCalculatedAt?: string
  error?: string
}

export interface ApplyResponsesPayload {
  [questionId: string]: QuestionnaireResponseValue
}
