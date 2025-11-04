import { useCallback, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import itIT from 'antd/locale/it_IT'
import { Provider } from 'react-redux'

import AppLayout from '@renderer/layout/AppLayout'
import WorkbenchPage from '@renderer/pages/Workbench'
import ProductsPage from '@renderer/pages/Products'
import SettingsPage from '@renderer/pages/Settings'
import { store } from '@renderer/store'
import {
  appTheme,
  DARK_PRIMARY,
  DARK_TOKENS,
  DEFAULT_SECONDARY,
  LIGHT_PRIMARY,
  LIGHT_TOKENS
} from '@renderer/theme'
import { ThemeSettingsContext, type ThemeColors } from '@renderer/theme/context'
import '@renderer/i18n'

const App = () => {
  const [secondary, setSecondary] = useState<string>(DEFAULT_SECONDARY)
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const colors = useMemo<ThemeColors>(
    () => ({
      primary: mode === 'dark' ? DARK_PRIMARY : LIGHT_PRIMARY,
      secondary
    }),
    [mode, secondary]
  )

  const setColors = useCallback((next: ThemeColors) => {
    setSecondary(next.secondary)
  }, [])

  const themeConfig = useMemo(
    () => {
      const baseTokens = mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS
      const textColor =
        typeof baseTokens.colorText === 'string'
          ? baseTokens.colorText
          : mode === 'dark'
            ? '#f8fafc'
            : '#1f2937'

      return {
        ...appTheme,
        token: {
          ...baseTokens,
          colorPrimary: colors.primary,
          colorInfo: colors.primary,
          colorSuccess: colors.secondary,
          colorSecondary: colors.secondary
        },
        components: {
          ...appTheme.components,
          Menu: {
            ...(appTheme.components?.Menu ?? {}),
            itemSelectedColor: colors.primary,
            horizontalItemHoverColor: colors.primary,
            itemSelectedBg:
              mode === 'dark'
                ? 'rgba(56, 189, 248, 0.18)'
                : 'rgba(11, 165, 236, 0.12)',
            itemHoverColor: colors.primary,
            itemColor: textColor,
            itemBg: 'transparent'
          },
          Button: {
            ...(appTheme.components?.Button ?? {}),
            defaultBg: mode === 'dark' ? '#1e293b' : '#ffffff',
            defaultColor: textColor,
            defaultBorderColor:
              mode === 'dark' ? 'rgba(148, 163, 184, 0.28)' : 'rgba(15, 23, 42, 0.08)',
            textHoverBg:
              mode === 'dark'
                ? 'rgba(56, 189, 248, 0.16)'
                : 'rgba(11, 165, 236, 0.08)'
          }
        },
        algorithm: [mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm]
      }
    },
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
