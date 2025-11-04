import { createContext, useContext } from 'react'

export interface ThemeColors {
  primary: string
  secondary: string
}

export interface ThemeSettingsContextValue {
  colors: ThemeColors
  setColors: (next: ThemeColors) => void
}

export const ThemeSettingsContext = createContext<ThemeSettingsContextValue | undefined>(undefined)

export const useThemeSettings = (): ThemeSettingsContextValue => {
  const ctx = useContext(ThemeSettingsContext)
  if (!ctx) {
    throw new Error('useThemeSettings must be used within ThemeSettingsContext provider')
  }
  return ctx
}
