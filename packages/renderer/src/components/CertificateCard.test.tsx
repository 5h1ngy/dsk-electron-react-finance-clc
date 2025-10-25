import { render, screen } from '@testing-library/react'

import CertificateCard from './CertificateCard'
import { useCertificateCard } from './CertificateCard.hooks'

jest.mock('./CertificateCard.hooks', () => ({
  useCertificateCard: jest.fn()
}))

const mockHook = useCertificateCard as jest.MockedFunction<typeof useCertificateCard>

describe('CertificateCard', () => {
  it('renders the certificate summary when metadata is available', () => {
    mockHook.mockReturnValue({
      certificate: {
        fileName: 'client.p12',
        base64: 'BASE64',
        loadedAt: new Date().toISOString()
      },
      summary: {
        subject: 'CN=Client',
        issuer: 'CN=Issuer',
        serialNumber: '123',
        notBefore: new Date('2024-01-01').toISOString(),
        notAfter: new Date('2025-01-01').toISOString(),
        thumbprint: 'ABC'
      },
      verifyModalOpen: false,
      password: '',
      verifying: false,
      handleUpload: jest.fn(),
      handleVerify: jest.fn(),
      handleClear: jest.fn(),
      openVerifyModal: jest.fn(),
      closeVerifyModal: jest.fn(),
      setPassword: jest.fn()
    })

    render(<CertificateCard />)

    expect(screen.getByText('certificate.buttons.verify')).toBeInTheDocument()
    expect(screen.getByText('client.p12')).toBeInTheDocument()
    expect(screen.getByText('ABC')).toBeInTheDocument()
  })

  it('shows placeholder text when no certificate is loaded', () => {
    mockHook.mockReturnValue({
      certificate: undefined,
      summary: undefined,
      verifyModalOpen: false,
      password: '',
      verifying: false,
      handleUpload: jest.fn(),
      handleVerify: jest.fn(),
      handleClear: jest.fn(),
      openVerifyModal: jest.fn(),
      closeVerifyModal: jest.fn(),
      setPassword: jest.fn()
    })

    render(<CertificateCard />)

    expect(screen.getByText('certificate.metadata.empty')).toBeInTheDocument()
  })
})
