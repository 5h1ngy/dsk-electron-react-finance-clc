import { renderHook } from '@testing-library/react'

import { useSchemaSummaryCard } from './SchemaSummaryCard.hooks'
import { useAppSelector } from '@renderer/store/hooks'

jest.mock('@renderer/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('useSchemaSummaryCard', () => {
  it('returns computed schema statistics', () => {
    const schema = {
      schemaVersion: '1.0',
      title: 'Schema',
      sections: [
        { id: 's1', label: 'S1', questions: [{ id: 'q1' }, { id: 'q2' }] },
        { id: 's2', label: 'S2', questions: [{ id: 'q3' }] }
      ]
    }

    jest.mocked(useAppSelector).mockReturnValueOnce(schema).mockReturnValueOnce('ready')

    const { result } = renderHook(() => useSchemaSummaryCard())

    expect(result.current.stats).toEqual({
      version: '1.0',
      sections: 2,
      questions: 3
    })
    expect(result.current.isLoading).toBe(false)
  })
})
