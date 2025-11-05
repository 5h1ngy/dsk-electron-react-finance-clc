import { riskOrder, riskToBands } from './rules'

describe('mapping rules', () => {
  it('defines risk bands for each ordered class', () => {
    expect(riskOrder).toEqual(['Conservativo', 'Prudente', 'Bilanciato', 'Dinamico'])
    riskOrder.forEach((riskClass, index) => {
      expect(riskToBands[riskClass]).toBeDefined()
      if (index > 0) {
        expect(riskToBands[riskClass]).toEqual(
          expect.arrayContaining(riskToBands[riskOrder[index - 1]])
        )
      }
    })
  })
})
