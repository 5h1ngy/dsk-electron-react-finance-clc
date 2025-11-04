import i18n from './index'

describe('renderer i18n', () => {
  it('initializes the default Italian namespace', () => {
    expect(i18n.language).toBe('it')
    expect(i18n.t('app.title')).toBeTruthy()
  })
})
