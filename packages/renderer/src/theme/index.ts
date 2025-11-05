import type { ThemeConfig } from 'antd'

type TokenOverrides = Record<string, string | number>

export const DEFAULT_ACCENT = '#10b981'

export const LIGHT_TOKENS: TokenOverrides = {
  colorPrimary: DEFAULT_ACCENT,
  colorInfo: DEFAULT_ACCENT,
  colorBgLayout: '#f5f7fa',
  colorBgContainer: '#ffffff',
  colorFillTertiary: '#e7f5ff',
  colorBorder: '#e2e8f0',
  colorText: '#1f2937',
  colorTextSecondary: '#475467',
  colorSuccessBg: '#ecfdf3',
  colorSuccessText: '#047857',
  colorErrorBg: '#fef2f2',
  colorErrorText: '#b91c1c',
  borderRadius: 18,
  borderRadiusLG: 24,
  boxShadowSecondary: '0 20px 45px rgba(15, 23, 42, 0.12)',
  boxShadowTertiary: '0 12px 32px rgba(15, 23, 42, 0.08)'
}

export const DARK_TOKENS: TokenOverrides = {
  colorPrimary: DEFAULT_ACCENT,
  colorInfo: DEFAULT_ACCENT,
  colorBgLayout: '#0f172a',
  colorBgContainer: '#1e293b',
  colorFillTertiary: '#16213b',
  colorBorder: '#1f2a40',
  colorText: '#e2e8f0',
  colorTextSecondary: '#94a3b8',
  colorSuccessBg: '#052e16',
  colorSuccessText: '#34d399',
  colorErrorBg: '#3f1d32',
  colorErrorText: '#fda4af',
  borderRadius: 18,
  borderRadiusLG: 24,
  boxShadowSecondary: '0 24px 55px rgba(2, 6, 23, 0.45)',
  boxShadowTertiary: '0 16px 40px rgba(2, 6, 23, 0.35)'
}

export const appTheme: ThemeConfig = {
  token: LIGHT_TOKENS,
  components: {
    Layout: {
      headerBg: '#041529',
      headerColor: '#ffffff',
      headerPadding: '0 32px'
    },
    Menu: {
      itemSelectedColor: DEFAULT_ACCENT,
      horizontalItemHoverColor: DEFAULT_ACCENT
    },
    Button: {
      borderRadius: 999,
      borderRadiusSM: 999,
      borderRadiusLG: 999,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      paddingInline: 20,
      paddingInlineSM: 16,
      paddingInlineLG: 24,
      fontWeight: 600
    },
    Card: {
      paddingLG: 24
    }
  }
}
