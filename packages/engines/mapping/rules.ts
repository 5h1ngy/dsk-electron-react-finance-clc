export const riskOrder = ['Conservativo', 'Prudente', 'Bilanciato', 'Dinamico'] as const
export type RiskClass = (typeof riskOrder)[number]

export const riskToBands: Record<RiskClass, string[]> = {
  Conservativo: ['Bassa'],
  Prudente: ['Bassa', 'Medio-Bassa'],
  Bilanciato: ['Bassa', 'Medio-Bassa', 'Medio'],
  Dinamico: ['Bassa', 'Medio-Bassa', 'Medio', 'Alta']
}

export interface ProductRecord {
  name: string
  category: string
  riskBand: string
  description?: string
}

export interface ProductRecommendation extends ProductRecord {
  matchReason: string
}

