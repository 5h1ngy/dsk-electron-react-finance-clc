import {
  selectCertificate,
  selectFinanceImport,
  selectPdfImport,
  selectReportExport,
  selectRequestImport
} from './selectors'

const state = {
  workspace: {
    requestImport: { fileName: 'q.xlsx' },
    financeImport: { fileName: 'p.xlsx' },
    pdfImport: { fileName: 'q.pdf' },
    reportExport: { fileName: 'report.pdf' },
    certificate: { fileName: 'cert.p12' }
  }
} as any

describe('workspace selectors', () => {
  it('extracts entities from state slice', () => {
    expect(selectRequestImport(state)).toEqual({ fileName: 'q.xlsx' })
    expect(selectFinanceImport(state)).toEqual({ fileName: 'p.xlsx' })
    expect(selectPdfImport(state)).toEqual({ fileName: 'q.pdf' })
    expect(selectReportExport(state)).toEqual({ fileName: 'report.pdf' })
    expect(selectCertificate(state)).toEqual({ fileName: 'cert.p12' })
  })
})
