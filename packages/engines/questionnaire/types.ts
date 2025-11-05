export type QuestionType = 'number' | 'percentage' | 'single_choice' | 'text'

export interface QuestionDefinition {
  id: string
  label: string
  type: QuestionType
  required: boolean
  weight: number
  unit?: string
  min?: number
  max?: number
  options?: string[]
}

export interface QuestionnaireSection {
  id: string
  label: string
  questions: QuestionDefinition[]
}

export interface QuestionnaireSchema {
  schemaVersion: string
  title: string
  sections: QuestionnaireSection[]
}

export type QuestionnaireResponseValue = number | string
export type QuestionnaireResponses = Record<string, QuestionnaireResponseValue>
