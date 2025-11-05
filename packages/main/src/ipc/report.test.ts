import { registerReportIpc } from '@main/ipc/report'
import type { ReportManifest } from '@main/services/signature'

jest.mock('electron', () => ({
  dialog: {
    showSaveDialog: jest
      .fn()
      .mockResolvedValue({ canceled: false, filePath: 'C:\\tmp\\report.pdf' })
  },
  ipcMain: {
    handle: jest.fn()
  }
}))

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('@main/services/signature', () => ({
  signReport: jest.fn()
}))

const { ipcMain, dialog } = jest.requireMock('electron')
const { writeFile } = jest.requireMock('node:fs/promises')
const { signReport } = jest.requireMock('@main/services/signature')

const manifestStub: ReportManifest = {
  document: {
    schemaVersion: 'v1',
    scoringVersion: '1.0.0',
    questionnaireTitle: 'Demo',
    generatedAt: '2024-01-01T00:00:00.000Z'
  },
  riskProfile: {
    score: 50,
    riskClass: 'Bilanciato',
    volatility: 'Media'
  },
  signature: {
    algorithm: 'SHA-256',
    value: 'DEMOHASH',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  certificate: {
    subject: 'CN=Demo',
    issuer: 'CN=Issuer',
    serialNumber: '01',
    notBefore: '2024-01-01T00:00:00.000Z',
    notAfter: '2025-01-01T00:00:00.000Z',
    thumbprint: 'ABC'
  }
}

describe('report export ipc', () => {
  beforeEach(() => {
    ipcMain.handle.mockClear()
    ;(dialog.showSaveDialog as jest.Mock).mockClear()
    ;(writeFile as jest.Mock).mockClear()
    ;(signReport as jest.Mock).mockReturnValue({
      pdf: Buffer.from('signed'),
      hash: 'ABC123',
      manifest: manifestStub
    })
  })

  it('registers handler', () => {
    registerReportIpc()
    expect(ipcMain.handle).toHaveBeenCalled()
  })

  it('signs pdf and writes companion files', async () => {
    registerReportIpc()
    const handler = ipcMain.handle.mock.calls[0][1]
    const response = await handler(
      {},
      {
        pdfBase64: Buffer.from('demo').toString('base64'),
        suggestedName: 'risk.pdf',
        certificate: {
          base64: 'ZmFrZQ==',
          password: 'secret',
          fileName: 'cert.p12'
        },
        metadata: {
          schemaVersion: 'v1',
          scoringVersion: '1.0.0',
          questionnaireTitle: 'Demo',
          generatedAt: '2024-01-01T00:00:00.000Z',
          riskClass: 'Bilanciato',
          riskScore: 50,
          volatility: 'Media'
        },
        includeManifest: true,
        includeHashFile: true
      }
    )

    expect(signReport).toHaveBeenCalled()
    expect(writeFile).toHaveBeenCalledWith('C:\\tmp\\report.pdf', Buffer.from('signed'))
    expect(writeFile).toHaveBeenCalledWith(
      'C:\\tmp\\report.sha256.txt',
      expect.any(String),
      expect.any(Object)
    )
    expect(writeFile).toHaveBeenCalledWith(
      'C:\\tmp\\report.manifest.json',
      expect.any(String),
      expect.any(Object)
    )
    expect(response.ok).toBe(true)
    expect(response.sha256).toBe('ABC123')
    expect(response.manifestPath).toBe('C:\\tmp\\report.manifest.json')
    expect(response.hashPath).toBe('C:\\tmp\\report.sha256.txt')
  })
})
