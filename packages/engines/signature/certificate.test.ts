import forge from 'node-forge'

import { arrayBufferToBase64, extractCertificateSummary } from './certificate'

jest.mock('node-forge', () => {
  const digest = {
    update: jest.fn(),
    digest: jest.fn(() => ({
      toHex: jest.fn(() => 'deadbeef')
    }))
  }

  const derObject = {
    getBytes: jest.fn(() => 'der-bytes')
  }

  const certificate = {
    subject: { attributes: [{ shortName: 'CN', value: 'Subject' }] },
    issuer: { attributes: [{ shortName: 'CN', value: 'Issuer' }] },
    serialNumber: 'abc123',
    validity: {
      notBefore: new Date('2024-01-01T00:00:00Z'),
      notAfter: new Date('2025-01-01T00:00:00Z')
    }
  }

  const forgeMock = {
    asn1: {
      toDer: jest.fn(() => derObject),
      fromDer: jest.fn(() => 'asn1')
    },
    util: {
      decode64: jest.fn(() => 'binary')
    },
    pkcs12: {
      pkcs12FromAsn1: jest.fn(() => ({
        getBags: jest.fn(() => ({
          certBag: [{ cert: certificate }]
        }))
      }))
    },
    pki: {
      oids: { certBag: 'certBag' },
      certificateToAsn1: jest.fn(() => 'asn1')
    },
    md: {
      sha1: {
        create: jest.fn(() => digest)
      }
    }
  }

  return {
    __esModule: true,
    default: forgeMock
  }
})

describe('extractCertificateSummary', () => {
  it('returns relevant certificate metadata and thumbprint', () => {
    const summary = extractCertificateSummary('base64', 'password')

    expect(summary).toMatchObject({
      subject: 'CN=Subject',
      issuer: 'CN=Issuer',
      serialNumber: 'ABC123',
      thumbprint: 'DEADBEEF'
    })
  })

  it('raises a readable error when no certificate is present', () => {
    const pkcs12 = {
      getBags: jest.fn(() => ({ certBag: [] }))
    }
    jest.spyOn(forge.pkcs12, 'pkcs12FromAsn1').mockReturnValueOnce(pkcs12 as never)

    expect(() => extractCertificateSummary('base64', 'password')).toThrow()
  })
})

describe('arrayBufferToBase64', () => {
  it('converts arbitrary bytes into base64', () => {
    const buffer = new Uint8Array([65, 66, 67]).buffer
    expect(arrayBufferToBase64(buffer)).toBe('QUJD')
  })
})
