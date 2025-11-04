import type { ThemeConfig } from 'antd'

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0ba5ec',
    colorSuccessBg: '#f0fff4',
    colorSuccessText: '#15803d',
    colorErrorBg: '#fef2f2',
    colorErrorText: '#b91c1c',
    colorBgLayout: '#f5f7fa',
    colorText: '#1f2937',
    colorTextSecondary: '#475467'
  },
  components: {
    Layout: {
      headerBg: '#041529',
      headerColor: '#ffffff',
      headerPadding: '0 32px'
    },
    Menu: {
      itemSelectedColor: '#0ba5ec',
      horizontalItemHoverColor: '#0ba5ec'
    },
    Card: {
      paddingLG: 24
    }
  }
}
