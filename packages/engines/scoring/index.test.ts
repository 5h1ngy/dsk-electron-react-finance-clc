import { loadQuestionnaireSchema } from '@renderer/config/questionnaire'
import { calculateRiskScore } from '@engines/scoring'

describe('calculateRiskScore', () => {
  it('returns higher scores for responses con maggiore esperienza', () => {
    const schema = loadQuestionnaireSchema()
    const conservativeResult = calculateRiskScore(schema, {
      exp_know_1: 1,
      exp_know_2: 'No',
      exp_know_3: 2,
      fin_1: 5,
      fin_2: 2,
      horizon_1: 1,
      goal_1: 'Conservazione capitale',
      risk_tol_1: 5,
      risk_tol_2: 'Venderei tutto'
    })

    const dynamicResult = calculateRiskScore(schema, {
      exp_know_1: 20,
      exp_know_2: 'Si',
      exp_know_3: 200,
      fin_1: 40,
      fin_2: 24,
      horizon_1: 25,
      goal_1: 'Crescita del capitale',
      risk_tol_1: 35,
      risk_tol_2: 'Mantengo o aumento'
    })

    expect(dynamicResult.score).toBeGreaterThan(conservativeResult.score)
  })
})


