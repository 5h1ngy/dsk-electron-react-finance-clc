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

const rationaleKeys: Record<string, string[]> = {
  Dinamico: ['scoring.rationales.Dinamico.0', 'scoring.rationales.Dinamico.1'],
  Bilanciato: ['scoring.rationales.Bilanciato.0', 'scoring.rationales.Bilanciato.1'],
  Prudente: ['scoring.rationales.Prudente.0', 'scoring.rationales.Prudente.1'],
  Conservativo: ['scoring.rationales.Conservativo.0', 'scoring.rationales.Conservativo.1']
}

const buildRationales = (score: number): string[] => {
  if (score >= 75) {
    return rationaleKeys.Dinamico
  }
  if (score >= 50) {
    return rationaleKeys.Bilanciato
  }
  if (score >= 25) {
    return rationaleKeys.Prudente
  }
  return rationaleKeys.Conservativo
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
