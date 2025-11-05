import { act, renderHook } from '@testing-library/react'

import { useCertificateCard } from './CertificateCard.hooks'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { setCertificate } from '@renderer/store/slices/workspace'
import { arrayBufferToBase64, extractCertificateSummary } from '@engines/signature'
import { Upload } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'

jest.mock('@renderer/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@engines/signature', () => ({
  arrayBufferToBase64: jest.fn(),
  extractCertificateSummary: jest.fn()
}))

jest.mock('antd', () => {
  const actual = jest.requireActual('antd')
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    }
  }
})

const mockDispatch = jest.fn()

const createFile = (): RcFile =>
  Object.assign(new File(['test'], 'cert.p12', { type: 'application/x-pkcs12' }), {
    uid: 'test',
    lastModifiedDate: new Date()
  })

describe('useCertificateCard', () => {
  beforeEach(() => {
    jest.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    jest.mocked(useAppSelector).mockReturnValue(undefined)
    mockDispatch.mockReset()
    jest.mocked(arrayBufferToBase64).mockReturnValue('BASE64')
    jest.mocked(extractCertificateSummary).mockReturnValue({
      subject: 'CN=Client',
      issuer: 'CN=Issuer',
      serialNumber: '123',
      notBefore: new Date('2024-01-01').toISOString(),
      notAfter: new Date('2025-01-01').toISOString(),
      thumbprint: 'abc'
    })
  })

  it('dispatches certificate metadata when uploading a file', async () => {
    const { result } = renderHook(() => useCertificateCard())

    let outcome: unknown
    await act(async () => {
      outcome = await result.current.handleUpload(createFile(), [])
    })

    expect(outcome).toBe(Upload.LIST_IGNORE)
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setCertificate.type,
        payload: expect.objectContaining({ fileName: 'cert.p12', base64: 'BASE64' })
      })
    )
  })

  it('verifies the certificate and stores the summary', async () => {
    jest.mocked(useAppSelector).mockReturnValue({
      fileName: 'cert.p12',
      base64: 'BASE64'
    })
    const { result } = renderHook(() => useCertificateCard())

    await act(async () => result.current.setPassword('secret'))
    await act(async () => {
      await result.current.handleVerify()
    })

    expect(extractCertificateSummary).toHaveBeenCalledWith('BASE64', 'secret')
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setCertificate.type,
        payload: expect.objectContaining({
          summary: expect.objectContaining({ subject: 'CN=Client' })
        })
      })
    )
  })
})
