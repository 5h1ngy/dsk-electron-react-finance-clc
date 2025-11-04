import { renderHook } from '@testing-library/react'

import { useProductUniverseCard } from './ProductUniverseCard.hooks'
import { useAppSelector } from '@renderer/store/hooks'

jest.mock('@renderer/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('useProductUniverseCard', () => {
  it('returns memoized categories and counts', () => {
    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce([{ name: 'Azioni', count: 2 }])
      .mockReturnValueOnce([{ name: 'Prodotto 1' }, { name: 'Prodotto 2' }])

    const { result } = renderHook(() => useProductUniverseCard())

    expect(result.current.categories).toEqual([{ name: 'Azioni', count: 2 }])
    expect(result.current.productCount).toBe(2)
    expect(result.current.title).toBe('productUniverse.title')
  })
})
