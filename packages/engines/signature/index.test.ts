import * as signature from './index'

describe('signature index', () => {
  it('re-exports certificate helpers and types', () => {
    expect(signature.extractCertificateSummary).toBeDefined()
    expect(signature.arrayBufferToBase64).toBeDefined()
  })
})
