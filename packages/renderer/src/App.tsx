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
import { appTheme, DARK_TOKENS, DEFAULT_ACCENT, LIGHT_TOKENS } from '@renderer/theme'
import { ThemeSettingsContext, type ThemeColors } from '@renderer/theme/context'
import '@renderer/i18n'

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '')
  const hexValue =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized.padEnd(6, '0')
  const bigint = parseInt(hexValue.slice(0, 6), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const App = () => {
  const [accent, setAccent] = useState<string>(DEFAULT_ACCENT)
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const colors = useMemo<ThemeColors>(
    () => ({
      primary: accent,
      secondary: accent
    }),
    [accent]
  )

  const setColors = useCallback((next: ThemeColors) => {
    if (next.secondary) {
      setAccent(next.secondary)
      return
    }
    if (next.primary) {
      setAccent(next.primary)
    }
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
          colorPrimary: accent,
          colorInfo: accent,
          colorSecondary: accent
        },
        components: {
          ...appTheme.components,
          Menu: {
            ...(appTheme.components?.Menu ?? {}),
            itemSelectedColor: accent,
            horizontalItemHoverColor: accent,
            itemSelectedBg: hexToRgba(accent, mode === 'dark' ? 0.3 : 0.18),
            itemHoverColor: accent,
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
          },
          Tabs: {
            ...(appTheme.components?.Tabs ?? {}),
            inkBarColor: accent,
            itemSelectedColor: accent,
            itemHoverColor: accent,
            itemActiveColor: accent
          },
          Steps: {
            ...(appTheme.components?.Steps ?? {}),
            colorPrimary: accent,
            colorPrimaryBorder: accent,
            colorText: textColor,
            colorTextDescription: textColor,
            colorWait: mode === 'dark' ? '#334155' : '#cbd5f5'
          },
          Progress: {
            ...(appTheme.components?.Progress ?? {}),
            defaultColor: accent,
            remainingColor: mode === 'dark' ? '#1f2937' : '#e2e8f0'
          },
          Tag: {
            ...(appTheme.components?.Tag ?? {}),
            defaultColor: accent,
            defaultBg: hexToRgba(accent, 0.12),
            defaultBorderColor: hexToRgba(accent, 0.25)
          },
          Switch: {
            ...(appTheme.components?.Switch ?? {}),
            colorPrimary: accent,
            colorPrimaryHover: accent
          }
        },
        algorithm: [mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm]
      }
    },
    [accent, mode]
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
