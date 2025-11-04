import { generateRiskReport } from './index'

describe('report index', () => {
  it('re-exports the PDF generator', () => {
    expect(typeof generateRiskReport).toBe('function')
  })
})
