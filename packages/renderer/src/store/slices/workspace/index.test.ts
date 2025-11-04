import * as workspace from './index'

describe('workspace index barrel', () => {
  it('re-exports actions and selectors', () => {
    expect(workspace.setCertificate).toBeDefined()
    expect(workspace.selectCertificate).toBeInstanceOf(Function)
  })
})
