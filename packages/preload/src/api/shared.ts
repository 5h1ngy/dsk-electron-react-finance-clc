import { ipcRenderer } from 'electron'

export const invokeIpc = async <T>(channel: string, ...args: unknown[]): Promise<T> => {
  const response = await ipcRenderer.invoke(channel, ...args)
  return response as T
}
