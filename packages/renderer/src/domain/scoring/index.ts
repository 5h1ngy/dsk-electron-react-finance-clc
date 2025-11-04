import type {
  QuestionnaireSchema,
  QuestionnaireResponseValue
} from '@renderer/domain/questionnaire'
import type { RiskScoreResult } from '@renderer/domain/scoring/types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const resolveRiskClass = (score: number): { label: string; volatility: RiskScoreResult['volatilityBand'] } => {
  if (score < 25) {
    return { label: 'Conservativo', volatility: 'Bassa' }
  }
  if (score < 50) {
    return { label: 'Prudente', volatility: 'Bassa' }
  }
  if (score < 75) {
    return { label: 'Bilanciato', volatility: 'Media' }
  }
  return { label: 'Dinamico', volatility: 'Elevata' }
}

const normalizeNumericResponse = (
  value: number,
  min?: number,
  max?: number
): number | undefined => {
  if (!Number.isFinite(value)) {
    return undefined
  }
  if (min === undefined || max === undefined || min === max) {
    return clamp(value / 100, 0, 1)
  }
  return clamp((value - min) / (max - min), 0, 1)
}

const normalizeChoiceResponse = (options: string[] | undefined, value: QuestionnaireResponseValue): number | undefined => {
  if (!options?.length) {
    return undefined
  }
  const index = options.findIndex((option) => option.toLowerCase() === String(value).toLowerCase())
  if (index < 0) {
    return undefined
  }
  if (options.length === 1) {
    return index === 0 ? 0 : 1
  }
  return clamp(index / (options.length - 1), 0, 1)
}

const normalizeResponse = (
  question: QuestionnaireSchema['sections'][number]['questions'][number],
  value: QuestionnaireResponseValue
): number | undefined => {
  switch (question.type) {
    case 'number':
    case 'percentage':
      return normalizeNumericResponse(Number(value), question.min, question.max)
    case 'single_choice':
      return normalizeChoiceResponse(question.options, value)
    default:
      return undefined
  }
}

const buildRationales = (score: number): string[] => {
  if (score >= 75) {
    return [
      'Profilo orientato alla crescita del capitale con elevata sopportazione della volatilita.',
      'Indicata esposizione significativa a strumenti dinamici e ciclici.'
    ]
  }
  if (score >= 50) {
    return [
      'Profilo bilanciato: disponibilita a rischi moderati per ottenere crescita nel medio periodo.',
      'Importante mantenere diversificazione tra strumenti difensivi e dinamici.'
    ]
  }
  if (score >= 25) {
    return [
      'Profilo prudente: priorita alla protezione del capitale con crescita contenuta.',
      'Preferenza per strumenti a bassa volatilita e soluzioni a durata media.'
    ]
  }
  return [
    'Profilo conservativo: capitale da preservare e bassa tolleranza alle perdite.',
    'Soluzioni raccomandate: linee garantite, monetari e titoli investment grade a breve.'
  ]
}

export const calculateRiskScore = (
  schema: QuestionnaireSchema,
  responses: Record<string, QuestionnaireResponseValue>
): RiskScoreResult => {
  let weightedTotal = 0
  let cumulativeWeight = 0
  const missing: string[] = []

  schema.sections.forEach((section) => {
    section.questions.forEach((question) => {
      cumulativeWeight += question.weight
      const response = responses[question.id]
      const normalized = response === undefined ? undefined : normalizeResponse(question, response)
      if (normalized === undefined) {
        if (question.required) {
          missing.push(question.label)
        }
        return
      }
      weightedTotal += normalized * question.weight
    })
  })

  const rawScore = cumulativeWeight > 0 ? (weightedTotal / cumulativeWeight) * 100 : 0
  const score = Math.round(clamp(rawScore, 0, 100))
  const { label, volatility } = resolveRiskClass(score)

  return {
    score,
    riskClass: label,
    volatilityBand: volatility,
    missingAnswers: missing,
    rationales: buildRationales(score)
  }
}

export * from '@renderer/domain/scoring/types'
