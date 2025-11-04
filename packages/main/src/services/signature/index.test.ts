import forge from 'node-forge'

jest.mock('node-signpdf', () => {
  return {
    SignPdf: class {
      sign(buffer: Buffer) {
        return Buffer.concat([buffer, Buffer.from('::signed')])
      }
    }
  }
})

jest.mock('node-signpdf/dist/helpers/plainAddPlaceholder', () => ({
  __esModule: true,
  default: jest.fn(({ pdfBuffer }: { pdfBuffer: Buffer }) => pdfBuffer)
}))

import { signReport } from '@main/services/signature'

const CERT_PASSWORD = 'Secret123!'

const buildTestCertificate = (): string => {
  const keys = forge.pki.rsa.generateKeyPair(1024)
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  const attrs = [{ name: 'commonName', value: 'Offline Risk Suite Test' }]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.sign(keys.privateKey, forge.md.sha256.create())

  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], CERT_PASSWORD, {
    friendlyName: 'offline-risk-suite',
    generateLocalKeyId: true
  })
  const der = forge.asn1.toDer(p12Asn1).getBytes()
  return Buffer.from(der, 'binary').toString('base64')
}

describe('signReport', () => {
  it('returns signed pdf data, hash and manifest', () => {
    const certificateBase64 = buildTestCertificate()
    const pdfBuffer = Buffer.from('%PDF-1.4 Mock document')

    const result = signReport({
      pdfBuffer,
      certificateBase64,
      certificatePassword: CERT_PASSWORD,
      metadata: {
        schemaVersion: 'v1',
        scoringVersion: '1.0.0',
        questionnaireTitle: 'Demo',
        generatedAt: new Date().toISOString(),
        riskClass: 'Bilanciato',
        riskScore: 50,
        volatility: 'Media'
      }
    })

    expect(result.pdf.equals(Buffer.concat([pdfBuffer, Buffer.from('::signed')]))).toBe(true)
    expect(result.hash).toHaveLength(64)
    expect(result.manifest.signature.value).toBe(result.hash)
    expect(result.certificate.subject).toContain('CN=Offline Risk Suite Test')
  })
})
