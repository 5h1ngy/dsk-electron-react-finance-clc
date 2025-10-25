import { reportApi } from './report'
import { invokeIpc } from '@preload/api/shared'

jest.mock('@preload/api/shared', () => ({
  invokeIpc: jest.fn()
}))

describe('reportApi', () => {
  it('invokes the IPC channel with the provided payload', async () => {
    jest.mocked(invokeIpc).mockResolvedValue({ ok: true })
    const payload = { pdfBase64: 'base64' }

    const response = await reportApi.exportPdf(payload as any)

    expect(invokeIpc).toHaveBeenCalledWith('report:export', payload)
    expect(response).toEqual({ ok: true })
  })
})
