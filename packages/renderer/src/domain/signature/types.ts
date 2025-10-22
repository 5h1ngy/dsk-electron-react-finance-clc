export interface CertificateSummary {
  subject: string
  issuer: string
  serialNumber: string
  notBefore: string
  notAfter: string
  thumbprint: string
}

export interface LoadedCertificate {
  fileName: string
  loadedAt: string
  base64: string
  summary?: CertificateSummary
}
