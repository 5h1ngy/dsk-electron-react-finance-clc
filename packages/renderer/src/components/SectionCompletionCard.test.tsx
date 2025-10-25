import { render, screen } from '@testing-library/react'

import SectionCompletionCard from './SectionCompletionCard'
import { useSectionCompletionCard } from './SectionCompletionCard.hooks'

jest.mock('./SectionCompletionCard.hooks', () => ({
  useSectionCompletionCard: jest.fn()
}))

const mockHook = useSectionCompletionCard as jest.MockedFunction<
  typeof useSectionCompletionCard
>

describe('SectionCompletionCard', () => {
  it('renders completion progress when schema exists', () => {
    mockHook.mockReturnValue({
      title: 'sectionCompletion.title',
      emptyText: 'sectionCompletion.empty',
      hasSchema: true,
      items: [{ title: 'Sezione 1', percent: 50 }]
    })

    render(<SectionCompletionCard />)

    expect(screen.getByText('Sezione 1')).toBeInTheDocument()
  })

  it('shows placeholder when schema is missing', () => {
    mockHook.mockReturnValue({
      title: 'sectionCompletion.title',
      emptyText: 'sectionCompletion.empty',
      hasSchema: false,
      items: []
    })

    render(<SectionCompletionCard />)

    expect(screen.getByText('sectionCompletion.empty')).toBeInTheDocument()
  })
})
