import { useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import itIT from 'antd/locale/it_IT'
import { Provider } from 'react-redux'

import AppLayout from '@renderer/layout/AppLayout'
import WorkbenchPage from '@renderer/pages/Workbench'
import ProductsPage from '@renderer/pages/Products'
import SettingsPage from '@renderer/pages/Settings'
import { store } from '@renderer/store'
import { appTheme } from '@renderer/theme'
import { ThemeSettingsContext, type ThemeColors } from '@renderer/theme/context'
import '@renderer/i18n'

const App = () => {
  const [colors, setColors] = useState<ThemeColors>({ primary: '#0ba5ec', secondary: '#10b981' })
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const themeConfig = useMemo(
    () => ({
      ...appTheme,
      token: {
        ...appTheme.token,
        colorPrimary: colors.primary,
        colorInfo: colors.primary,
        colorSuccess: colors.secondary,
        colorSecondary: colors.secondary
      },
      algorithm: [mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm]
    }),
    [colors, mode]
  )

  return (
    <Provider store={store}>
      <ThemeSettingsContext.Provider value={{ colors, setColors, mode, setMode }}>
        <ConfigProvider locale={itIT} theme={themeConfig}>
          <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppLayout>
              <Routes>
                <Route index element={<WorkbenchPage />} />
                <Route path="/prodotti" element={<ProductsPage />} />
                <Route path="/impostazioni" element={<SettingsPage />} />
                <Route path="*" element={<WorkbenchPage />} />
              </Routes>
            </AppLayout>
          </HashRouter>
        </ConfigProvider>
      </ThemeSettingsContext.Provider>
    </Provider>
  )
}

export default App
