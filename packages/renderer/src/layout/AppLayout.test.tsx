import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
describe('AppLayout', () => {
  it('renders navigation chrome and children', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Workbench</div>
        </AppLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Workbench')).toBeInTheDocument()
  })
})
