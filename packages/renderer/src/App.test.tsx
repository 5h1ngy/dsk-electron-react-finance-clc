import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@renderer/pages/Workbench', () => ({
  __esModule: true,
  default: () => <div>WorkbenchPage</div>
}))

jest.mock('@renderer/pages/Diagnostics', () => ({
  __esModule: true,
  default: () => <div>DiagnosticsPage</div>
}))

jest.mock('@renderer/layout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

import App from './App'

describe('App', () => {
  it('renders the main layout with the default route', async () => {
    render(<App />)

    expect(await screen.findByText('WorkbenchPage')).toBeInTheDocument()
  })
})
