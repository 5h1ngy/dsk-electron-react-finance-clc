import { fireEvent, render, screen } from '@testing-library/react'

import HealthStatusTag from './StatusTag'

const snapshot = {
  version: '1.0.0',
  timestamp: new Date('2024-01-01').toISOString(),
  status: 'ok',
  uptimeSeconds: 10
}

describe('HealthStatusTag', () => {
  it('renders error state with retry action', () => {
    const onRefresh = jest.fn()

    render(
      <HealthStatusTag snapshot={null} loading={false} error="failure" onRefresh={onRefresh} />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onRefresh).toHaveBeenCalled()
    expect(screen.getByText('health.status.offline')).toBeInTheDocument()
  })

  it('renders healthy state with timestamp information', () => {
    const onRefresh = jest.fn()

    render(
      <HealthStatusTag snapshot={snapshot} loading={false} error={null} onRefresh={onRefresh} />
    )

    expect(screen.getByText('health.status.healthy')).toBeInTheDocument()
    expect(screen.getByLabelText('health.status.refreshAria')).toBeInTheDocument()
  })
})
