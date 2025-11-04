declare module 'node-signpdf' {
  export interface SignOptions {
    passphrase?: string
  }

  export class SignPdf {
    sign(pdfBuffer: Buffer, p12Buffer: Buffer, options?: SignOptions): Buffer
  }
}

declare module 'node-signpdf/dist/helpers/plainAddPlaceholder' {
  export interface PlaceholderOptions {
    pdfBuffer: Buffer
    reason?: string
    contactInfo?: string
    location?: string
    signerName?: string
    signatureLength?: number
  }

  export default function plainAddPlaceholder(options: PlaceholderOptions): Buffer
}
