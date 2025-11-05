import { act, renderHook } from '@testing-library/react'

import { useScoreCard } from './ScoreCard.hooks'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { useReportExporter } from '@renderer/hooks/useReportExporter'
import { buildRecommendations } from '@renderer/store/slices/productUniverse/slice'
import { setRecommendations } from '@renderer/store/slices/productUniverse'
import type { RiskScoreResult } from '@engines/scoring'

jest.mock('@renderer/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@renderer/hooks/useReportExporter', () => ({
  useReportExporter: jest.fn()
}))

jest.mock('@renderer/store/slices/productUniverse/slice', () => {
  const actual = jest.requireActual('@renderer/store/slices/productUniverse/slice')
  return {
    ...actual,
    buildRecommendations: jest.fn()
  }
})

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

describe('useScoreCard', () => {
  const baseScore: RiskScoreResult = {
    score: 70,
    riskClass: 'Prudente',
    volatilityBand: 'Media',
    missingAnswers: [],
    rationales: []
  }

  beforeEach(() => {
    jest.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    jest.mocked(useReportExporter).mockReturnValue({
      exportReport: jest.fn().mockResolvedValue(true),
      exportUnsignedReport: jest.fn().mockResolvedValue(true),
      exporting: false
    })
    mockDispatch.mockReset()
    jest.mocked(useAppSelector).mockReset()
  })

  it('dispatches recommendations when score and products are available', () => {
    jest
      .mocked(buildRecommendations)
      .mockReturnValue([
        { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Match' }
      ])
    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce(baseScore)
      .mockReturnValueOnce({ lastCalculatedAt: new Date().toISOString() })
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ fileName: 'cert.p12', base64: 'BASE64' })
      .mockReturnValueOnce([
        { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Match' }
      ])

    renderHook(() => useScoreCard())

    expect(buildRecommendations).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(
      setRecommendations([
        { name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa', matchReason: 'Match' }
      ])
    )
  })

  it('opens unsigned export modal when certificate is missing', async () => {
    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce(baseScore)
      .mockReturnValueOnce({})
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([])

    const { result } = renderHook(() => useScoreCard())

    await act(async () => {
      result.current.handleExportClick()
    })

    expect(result.current.unsignedModalOpen).toBe(true)
  })
})
