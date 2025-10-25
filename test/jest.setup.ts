import '@testing-library/jest-dom'

jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next')
  const translation = {
    t: (key: string, params?: Record<string, unknown>) =>
      params ? `${key}:${JSON.stringify(params)}` : key
  }
  return {
    ...actual,
    useTranslation: () => translation
  }
})

beforeEach(() => {
  window.api = {
    health: {
      check: jest.fn().mockResolvedValue({
        ok: true,
        data: {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          status: 'ok',
          uptimeSeconds: 1
        }
      })
    },
    report: {
      exportPdf: jest.fn().mockResolvedValue({
        ok: true,
        cancelled: false,
        savedAt: new Date().toISOString()
      })
    }
  }
})

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  })
}
