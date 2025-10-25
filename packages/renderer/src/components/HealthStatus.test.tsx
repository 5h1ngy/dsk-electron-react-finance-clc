import * as HealthStatus from './HealthStatus'

describe('HealthStatus barrel', () => {
  it('re-exports the StatusTag component', () => {
    expect(HealthStatus.HealthStatusTag).toBeDefined()
  })
})
