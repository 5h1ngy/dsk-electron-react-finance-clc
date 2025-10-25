import { createHash } from 'node:crypto'
import { Buffer } from 'node:buffer'
import forge from 'node-forge'
import { SignPdf } from 'node-signpdf'
import plainAddPlaceholder from 'node-signpdf/dist/helpers/plainAddPlaceholder'

const HASH_ALGORITHM = 'SHA-256'

export interface CertificateDetails {
  subject: string
  issuer: string
  serialNumber: string
  notBefore: string
  notAfter: string
  thumbprint: string
}

export interface ReportMetadataPayload {
  schemaVersion: string
  scoringVersion: string
  questionnaireTitle: string
  generatedAt: string
  riskClass: string
  riskScore: number
  volatility: string
}

export interface ReportManifest {
  document: {
    schemaVersion: string
    scoringVersion: string
    questionnaireTitle: string
    generatedAt: string
  }
  riskProfile: {
    score: number
    riskClass: string
    volatility: string
  }
  signature: {
    algorithm: typeof HASH_ALGORITHM
    value: string
    createdAt: string
  }
  certificate: CertificateDetails
}

export interface SignReportPayload {
  pdfBuffer: Buffer
  certificateBase64: string
  certificatePassword: string
  metadata: ReportMetadataPayload
}

export interface SignedReport {
  pdf: Buffer
  hash: string
  manifest: ReportManifest
  certificate: CertificateDetails
}

const formatDistinguishedName = (attributes: forge.pki.CertificateField[]): string =>
  attributes
    .map((attribute) => `${attribute.shortName ?? attribute.name}=${attribute.value}`)
    .join(', ')

const computeThumbprint = (certificate: forge.pki.Certificate): string => {
  const der = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes()
  const digest = forge.md.sha1.create()
  digest.update(der)
  return digest.digest().toHex().toUpperCase()
}

const extractCertificateDetails = (
  base64: string,
  password: string
): CertificateDetails => {
  const der = forge.util.decode64(base64)
  const asn1 = forge.asn1.fromDer(der)
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, password)
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
  const certificate = certBags?.[forge.pki.oids.certBag]?.[0]?.cert
  if (!certificate) {
    throw new Error('Nessun certificato disponibile nel file PKCS#12.')
  }
  return {
    subject: formatDistinguishedName(certificate.subject.attributes),
    issuer: formatDistinguishedName(certificate.issuer.attributes),
    serialNumber: certificate.serialNumber?.toUpperCase() ?? 'N/D',
    notBefore: certificate.validity.notBefore.toISOString(),
    notAfter: certificate.validity.notAfter.toISOString(),
    thumbprint: computeThumbprint(certificate)
  }
}

const signPdfBuffer = (
  pdfBuffer: Buffer,
  certificateBuffer: Buffer,
  passphrase: string
): Buffer => {
  const signer = new SignPdf()
  const pdfWithPlaceholder = plainAddPlaceholder({
    pdfBuffer,
    reason: 'Offline Risk Suite - Profilazione rischio',
    location: 'Offline workstation',
    signatureLength: 8192
  })
  return signer.sign(pdfWithPlaceholder, certificateBuffer, {
    passphrase
  })
}

const buildManifest = (
  hash: string,
  metadata: ReportMetadataPayload,
  certificate: CertificateDetails
): ReportManifest => ({
  document: {
    schemaVersion: metadata.schemaVersion,
    scoringVersion: metadata.scoringVersion,
    questionnaireTitle: metadata.questionnaireTitle,
    generatedAt: metadata.generatedAt
  },
  riskProfile: {
    score: metadata.riskScore,
    riskClass: metadata.riskClass,
    volatility: metadata.volatility
  },
  signature: {
    algorithm: HASH_ALGORITHM,
    value: hash,
    createdAt: new Date().toISOString()
  },
  certificate
})

export const signReport = ({
  pdfBuffer,
  certificateBase64,
  certificatePassword,
  metadata
}: SignReportPayload): SignedReport => {
  const certificate = extractCertificateDetails(certificateBase64, certificatePassword)
  const certificateBuffer = Buffer.from(certificateBase64, 'base64')
  const signedPdf = signPdfBuffer(pdfBuffer, certificateBuffer, certificatePassword)
  const hash = createHash('sha256').update(signedPdf).digest('hex').toUpperCase()
  const manifest = buildManifest(hash, metadata, certificate)

  return {
    pdf: signedPdf,
    hash,
    manifest,
    certificate
  }
}
