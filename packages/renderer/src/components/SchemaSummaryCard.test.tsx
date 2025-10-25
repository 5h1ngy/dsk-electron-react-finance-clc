import { render, screen } from '@testing-library/react'

import SchemaSummaryCard from './SchemaSummaryCard'
import { useSchemaSummaryCard } from './SchemaSummaryCard.hooks'

jest.mock('./SchemaSummaryCard.hooks', () => ({
  useSchemaSummaryCard: jest.fn()
}))

const mockHook = useSchemaSummaryCard as jest.MockedFunction<typeof useSchemaSummaryCard>

describe('SchemaSummaryCard', () => {
  it('renders stats when schema is available', () => {
    mockHook.mockReturnValue({
      title: 'schemaSummary.title',
      isLoading: false,
      hasSchema: true,
      stats: {
        version: '1.0',
        sections: 3,
        questions: 12
      },
      labels: {
        version: 'schemaSummary.version',
        sections: 'schemaSummary.sections',
        questions: 'schemaSummary.questions'
      },
      emptyText: 'schemaSummary.empty'
    })

    render(<SchemaSummaryCard />)

    expect(screen.getByText('schemaSummary.version')).toBeInTheDocument()
    expect(screen.getByText('schemaSummary.sections')).toBeInTheDocument()
    expect(screen.getByText('schemaSummary.questions')).toBeInTheDocument()
  })

  it('shows empty text when schema is missing', () => {
    mockHook.mockReturnValue({
      title: 'schemaSummary.title',
      isLoading: false,
      hasSchema: false,
      stats: null,
      labels: {
        version: 'schemaSummary.version',
        sections: 'schemaSummary.sections',
        questions: 'schemaSummary.questions'
      },
      emptyText: 'schemaSummary.empty'
    })

    render(<SchemaSummaryCard />)

    expect(screen.getByText('schemaSummary.empty')).toBeInTheDocument()
  })
})

