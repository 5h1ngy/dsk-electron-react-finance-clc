import forge from 'node-forge'

import type { CertificateSummary } from '@renderer/domain/signature/types'

const formatDistinguishedName = (attributes: forge.pki.CertificateField['attributes']): string =>
  attributes
    .map((attribute) => `${attribute.shortName ?? attribute.name}=${attribute.value}`)
    .join(', ')

const computeThumbprint = (certificate: forge.pki.Certificate): string => {
  const der = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes()
  const digest = forge.md.sha1.create()
  digest.update(der)
  return digest.digest().toHex().toUpperCase()
}

const decodePkcs12 = (base64: string, password: string): forge.pkcs12.Pkcs12Pfx => {
  const der = forge.util.decode64(base64)
  const asn1 = forge.asn1.fromDer(der)
  return forge.pkcs12.pkcs12FromAsn1(asn1, password)
}

export const extractCertificateSummary = (
  base64: string,
  password: string
): CertificateSummary => {
  try {
    const p12 = decodePkcs12(base64, password)
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
    const cert = certBags?.[forge.pki.oids.certBag]?.[0]?.cert
    if (!cert) {
      throw new Error('Nessun certificato presente nel file PKCS#12')
    }
    return {
      subject: formatDistinguishedName(cert.subject.attributes),
      issuer: formatDistinguishedName(cert.issuer.attributes),
      serialNumber: cert.serialNumber?.toUpperCase() ?? 'N/D',
      notBefore: cert.validity.notBefore.toISOString(),
      notAfter: cert.validity.notAfter.toISOString(),
      thumbprint: computeThumbprint(cert)
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Impossibile leggere il certificato P12'
    throw new Error(message)
  }
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}
