import { reportApi } from './report'
import { invokeIpc } from '@preload/api/shared'
import type { ReportExportPayload } from '@main/ipc/report'

jest.mock('@preload/api/shared', () => ({
  invokeIpc: jest.fn()
}))

describe('reportApi', () => {
  it('invokes the IPC channel with the provided payload', async () => {
    jest.mocked(invokeIpc).mockResolvedValue({ ok: true })
    const payload: ReportExportPayload = {
      pdfBase64: 'base64',
      suggestedName: 'report.pdf',
      certificate: {
        base64: 'cert',
        password: 'secret',
        fileName: 'cert.p12'
      },
      metadata: {
        schemaVersion: '1.0.0',
        scoringVersion: '1.0.0',
        questionnaireTitle: 'Test schema',
        generatedAt: new Date().toISOString(),
        riskClass: 'Prudente',
        riskScore: 70,
        volatility: 'Media'
      }
    }

    const response = await reportApi.exportPdf(payload)

    expect(invokeIpc).toHaveBeenCalledWith('report:export', payload)
    expect(response).toEqual({ ok: true })
  })
})
