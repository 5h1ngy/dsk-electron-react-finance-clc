import { act, renderHook } from '@testing-library/react'

import { useReportExporter } from './useReportExporter'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { generateRiskReport } from '@engines/report'
import { extractCertificateSummary } from '@engines/signature'
import { setReportExport } from '@renderer/store/slices/workspace'
import { message } from 'antd'

jest.mock('@renderer/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@engines/report', () => ({
  generateRiskReport: jest.fn()
}))

jest.mock('@engines/signature', () => ({
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

describe('useReportExporter', () => {
  beforeEach(() => {
    jest.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    mockDispatch.mockReset()
    jest.mocked(useAppSelector).mockReset()
  })

  it('warns when schema or score data is missing', async () => {
    jest.mocked(useAppSelector).mockReturnValueOnce(null)

    const { result } = renderHook(() => useReportExporter())

    await act(async () => {
      const ok = await result.current.exportReport('secret')
      expect(ok).toBe(false)
    })

    expect(message.warning).toHaveBeenCalledWith('report.messages.missingData')
  })

  it('exports the report and stores metadata', async () => {
    const schema = {
      schemaVersion: '1',
      title: 'Questionario',
      sections: []
    }
    const anagraficaSchema = {
      schemaVersion: '1',
      title: 'Anagrafica',
      sections: []
    }
    const score = {
      score: 80,
      riskClass: 'Prudente',
      volatilityBand: 'Medio',
      missingAnswers: [],
      rationales: []
    }
    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce(schema)
      .mockReturnValueOnce({ q1: 1 })
      .mockReturnValueOnce(anagraficaSchema)
      .mockReturnValueOnce({ identity_first_name: 'Mario' })
      .mockReturnValueOnce(score)
      .mockReturnValueOnce({ fileName: 'cert.p12', base64: 'BASE64' })

    jest.mocked(generateRiskReport).mockResolvedValue(new Uint8Array([1, 2]))
    jest.mocked(extractCertificateSummary).mockReturnValue({
      subject: 'CN=Client',
      issuer: 'CN=Issuer',
      serialNumber: '123',
      notBefore: '',
      notAfter: '',
      thumbprint: 'abc'
    })
    window.api.report.exportPdf = jest.fn().mockResolvedValue({
      ok: true,
      cancelled: false,
      savedAt: '2024-01-01T00:00:00Z',
      sha256: 'hash',
      manifestPath: 'manifest.json',
      hashPath: 'hash.txt'
    })

    const { result } = renderHook(() => useReportExporter())

    let resolved = false
    await act(async () => {
      resolved = await result.current.exportReport('secret')
    })

    expect(resolved).toBe(true)
    expect(generateRiskReport).toHaveBeenCalledWith({
      questionnaire: { schema, responses: { q1: 1 }, score },
      anagrafica: { schema: anagraficaSchema, responses: { identity_first_name: 'Mario' } }
    })
    expect(window.api.report.exportPdf).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(
      setReportExport(
        expect.objectContaining({
          fileName: expect.stringContaining('risk-report'),
          sha256: 'hash'
        })
      )
    )
  })
})
