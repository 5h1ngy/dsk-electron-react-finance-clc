import { renderHook } from '@testing-library/react'

import { useDiagnosticsPage } from './hooks'
import { useAppSelector } from '@renderer/store/hooks'
import { useHealthStatus } from '@renderer/hooks/useHealthStatus'

jest.mock('@renderer/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

jest.mock('@renderer/hooks/useHealthStatus', () => ({
  useHealthStatus: jest.fn()
}))

describe('useDiagnosticsPage', () => {
  beforeEach(() => {
    jest.mocked(useHealthStatus).mockReturnValue({
      snapshot: null,
      loading: false,
      error: null,
      refresh: jest.fn()
    })
    jest.mocked(useAppSelector).mockReset().mockReturnValue(undefined)
  })

  it('builds import entries with fallback values', () => {
    const { result } = renderHook(() => useDiagnosticsPage())

    expect(result.current.importEntries).toHaveLength(8)
    expect(result.current.importEntries[0].value).toBe('diagnostics.imports.empty.questionnaire')
    expect(result.current.healthCard.title).toBe('health.card.title')
  })
})
