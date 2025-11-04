import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@renderer/pages/Profilation', () => ({
  __esModule: true,
  default: () => <div>ProfilationPage</div>
}))

jest.mock('@renderer/pages/Products', () => ({
  __esModule: true,
  default: () => <div>ProductsPage</div>
}))

jest.mock('@renderer/pages/Settings', () => ({
  __esModule: true,
  default: () => <div>SettingsPage</div>
}))

jest.mock('@renderer/layout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

import App from './App'

describe('App', () => {
  it('renders the main layout with the default route', async () => {
    render(<App />)

    expect(await screen.findByText('ProfilationPage')).toBeInTheDocument()
  })
})
