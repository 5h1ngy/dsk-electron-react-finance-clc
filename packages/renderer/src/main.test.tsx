const mockedCreateRoot = jest.fn(() => ({
  render: jest.fn()
}))

jest.mock('react-dom/client', () => ({
  createRoot: mockedCreateRoot
}))

jest.mock('./App', () => ({
  __esModule: true,
  default: () => null
}))

describe('renderer entrypoint', () => {
  beforeEach(() => {
    jest.resetModules()
    mockedCreateRoot.mockClear()
    document.body.innerHTML = ''
  })

  it('throws when the root container is missing', async () => {
    await expect(import('./main')).rejects.toThrow('Root container not found')
  })

  it('mounts the React application into the root container', async () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    await expect(import('./main')).resolves.toBeDefined()
    expect(mockedCreateRoot).toHaveBeenCalled()
  })
})
