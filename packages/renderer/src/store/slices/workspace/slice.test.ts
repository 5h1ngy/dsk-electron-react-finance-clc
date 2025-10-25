import {
  workspaceReducer,
  setCertificate,
  setRequestImport,
  setReportExport
} from './slice'

describe('workspace slice', () => {
  it('stores certificate metadata', () => {
    const state = workspaceReducer(
      undefined,
      setCertificate({ fileName: 'cert.p12', loadedAt: 'now', base64: 'BASE64' })
    )
    expect(state.certificate?.fileName).toBe('cert.p12')
  })

  it('tracks imports and exports independently', () => {
    let state = workspaceReducer(
      undefined,
      setRequestImport({ fileName: 'questionario.xlsx', importedAt: 'now', responses: 10 })
    )
    state = workspaceReducer(
      state,
      setReportExport({
        fileName: 'report.pdf',
        exportedAt: 'now',
        sha256: 'hash'
      })
    )
    expect(state.requestImport?.fileName).toBe('questionario.xlsx')
    expect(state.reportExport?.sha256).toBe('hash')
  })
})
