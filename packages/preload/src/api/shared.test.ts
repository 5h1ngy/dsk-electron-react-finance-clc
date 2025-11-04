import { invokeIpc } from './shared'
import { ipcRenderer } from 'electron'

jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn()
  }
}))

describe('invokeIpc', () => {
  it('delegates to ipcRenderer.invoke preserving arguments', async () => {
    jest.mocked(ipcRenderer.invoke).mockResolvedValue({ ok: true })

    const response = await invokeIpc('channel', { payload: 1 })

    expect(ipcRenderer.invoke).toHaveBeenCalledWith('channel', { payload: 1 })
    expect(response).toEqual({ ok: true })
  })
})
