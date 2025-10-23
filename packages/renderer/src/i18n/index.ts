import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '@renderer/locales/en/common.json'
import itCommon from '@renderer/locales/it/common.json'

void i18n.use(initReactI18next).init({
  resources: {
    it: { translation: itCommon },
    en: { translation: enCommon }
  },
  lng: 'it',
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
})

export default i18n
