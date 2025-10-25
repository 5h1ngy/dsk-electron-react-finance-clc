import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import { useHealthStatus } from '@renderer/hooks/useHealthStatus'

jest.mock('@renderer/hooks/useHealthStatus', () => ({
  useHealthStatus: jest.fn()
}))

describe('AppLayout', () => {
  it('renders navigation chrome and children', () => {
    jest.mocked(useHealthStatus).mockReturnValue({
      snapshot: null,
      loading: false,
      error: null,
      refresh: jest.fn()
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Workbench</div>
        </AppLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Workbench')).toBeInTheDocument()
    expect(screen.getByText('app.title')).toBeInTheDocument()
  })
})
