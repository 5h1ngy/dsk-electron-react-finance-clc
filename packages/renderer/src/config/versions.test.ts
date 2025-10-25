import { REPORT_TEMPLATE_VERSION, SCORING_ENGINE_VERSION } from './versions'

describe('versions config', () => {
  it('exposes immutable version identifiers', () => {
    expect(SCORING_ENGINE_VERSION).toMatch(/\d+\.\d+\.\d+/)
    expect(REPORT_TEMPLATE_VERSION).toMatch(/\d+\.\d+\.\d+/)
  })
})
