import { renderHook } from '@testing-library/react'

import { useSectionCompletionCard } from './SectionCompletionCard.hooks'
import { useAppSelector } from '@renderer/store/hooks'

jest.mock('@renderer/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('useSectionCompletionCard', () => {
  it('calculates completion percentages per section', () => {
    const schema = {
      sections: [
        {
          id: 's1',
          label: 'Sezione 1',
          questions: [
            { id: 'q1', required: true },
            { id: 'q2', required: false }
          ]
        }
      ]
    }
    const responses = { q1: 'yes', q2: 'value' }

    jest.mocked(useAppSelector).mockReturnValueOnce(schema).mockReturnValueOnce(responses)

    const { result } = renderHook(() => useSectionCompletionCard())

    expect(result.current.items[0]).toMatchObject({
      title: 'Sezione 1',
      percent: 100
    })
  })
})
