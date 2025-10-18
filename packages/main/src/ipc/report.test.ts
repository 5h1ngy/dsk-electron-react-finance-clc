import { registerReportIpc } from '@main/ipc/report'

jest.mock('electron', () => ({
  dialog: {
    showSaveDialog: jest.fn().mockResolvedValue({ canceled: false, filePath: 'report.pdf' })
  },
  ipcMain: {
    handle: jest.fn()
  }
}))

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined)
}))

const { ipcMain, dialog } = jest.requireMock('electron')
const { writeFile } = jest.requireMock('node:fs/promises')

describe('report export ipc', () => {
  beforeEach(() => {
    ipcMain.handle.mockClear()
    ;(dialog.showSaveDialog as jest.Mock).mockClear()
    ;(writeFile as jest.Mock).mockClear()
  })

  it('registers handler', () => {
    registerReportIpc()
    expect(ipcMain.handle).toHaveBeenCalled()
  })
})
