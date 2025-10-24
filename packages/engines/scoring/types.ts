export interface RiskScoreResult {
  score: number
  riskClass: string
  volatilityBand: 'Bassa' | 'Media' | 'Elevata'
  missingAnswers: string[]
  rationales: string[]
}
