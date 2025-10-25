import { render, screen } from '@testing-library/react'

jest.mock('@renderer/components/SchemaSummaryCard', () => ({
  __esModule: true,
  default: () => 'SchemaSummaryCard'
}))

import DiagnosticsPage from './index'
import { useDiagnosticsPage } from './hooks'

jest.mock('./hooks', () => ({
  useDiagnosticsPage: jest.fn()
}))

const mockHook = useDiagnosticsPage as jest.MockedFunction<typeof useDiagnosticsPage>

describe('DiagnosticsPage', () => {
  it('renders cards using hook data', () => {
    mockHook.mockReturnValue({
      importsTitle: 'diagnostics.imports.title',
      importEntries: [{ label: 'diagnostics.imports.labels.questionnaire', value: 'value' }],
      healthCard: {
        title: 'health.card.title',
        refreshLabel: 'health.card.refresh',
        waiting: 'health.card.waiting',
        labels: {
          version: 'diagnostics.health.version',
          status: 'diagnostics.health.status',
          uptime: 'diagnostics.health.uptime'
        },
        snapshot: null,
        loading: false,
        error: null,
        refresh: jest.fn()
      }
    })

    render(<DiagnosticsPage />)

    expect(screen.getByText('diagnostics.imports.labels.questionnaire')).toBeInTheDocument()
    expect(screen.getByText('health.card.refresh')).toBeInTheDocument()
  })
})
