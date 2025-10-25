import { renderHook } from '@testing-library/react'

import { useSuggestedProductsCard } from './SuggestedProductsCard.hooks'
import { useAppSelector } from '@renderer/store/hooks'

jest.mock('@renderer/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('useSuggestedProductsCard', () => {
  it('returns memoized recommendations and formatter', () => {
    jest
      .mocked(useAppSelector)
      .mockReturnValue([{ name: 'Prodotto', category: 'Azioni', riskBand: 'Bassa' }])

    const { result } = renderHook(() => useSuggestedProductsCard())

    expect(result.current.recommendations).toHaveLength(1)
    expect(result.current.formatRiskBand('Bassa')).toBe('risk.band.Bassa')
  })
})
