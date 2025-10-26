import {
  selectCertificate,
  selectFinanceImport,
  selectPdfImport,
  selectReportExport,
  selectRequestImport
} from './selectors'
import type { RootState } from '@renderer/store/types'

const buildState = (): RootState => ({
  questionnaire: undefined as never,
  productUniverse: undefined as never,
  workspace: {
    requestImport: { fileName: 'q.xlsx', importedAt: 'now', responses: 10 },
    financeImport: {
      fileName: 'p.xlsx',
      importedAt: 'now',
      instruments: 5,
      categories: [{ name: 'Azioni', count: 5 }]
    },
    pdfImport: { fileName: 'q.pdf', importedAt: 'now', pages: 2 },
    reportExport: { fileName: 'report.pdf', exportedAt: 'now' },
    certificate: { fileName: 'cert.p12', loadedAt: 'now', base64: 'BASE64' }
  }
})

describe('workspace selectors', () => {
  it('extracts entities from state slice', () => {
    const state = buildState()
    expect(selectRequestImport(state)).toEqual({
      fileName: 'q.xlsx',
      importedAt: 'now',
      responses: 10
    })
    expect(selectFinanceImport(state)).toEqual({
      fileName: 'p.xlsx',
      importedAt: 'now',
      instruments: 5,
      categories: [{ name: 'Azioni', count: 5 }]
    })
    expect(selectPdfImport(state)).toEqual({ fileName: 'q.pdf', importedAt: 'now', pages: 2 })
    expect(selectReportExport(state)).toEqual({ fileName: 'report.pdf', exportedAt: 'now' })
    expect(selectCertificate(state)).toEqual({
      fileName: 'cert.p12',
      loadedAt: 'now',
      base64: 'BASE64'
    })
  })
})
