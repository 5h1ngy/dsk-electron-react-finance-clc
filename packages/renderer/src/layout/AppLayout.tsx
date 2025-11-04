import { BankOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Layout, theme } from 'antd'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useHealthStatus } from '@renderer/hooks/useHealthStatus'
import AppLayoutHeader from '@renderer/layout/AppLayout.Header'

const { Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { snapshot, loading, error, refresh } = useHealthStatus()
  const { t } = useTranslation()
  const { token } = theme.useToken()

  const menuItems = [
    { key: '/', label: t('app.menu.workbench'), icon: <BankOutlined /> },
    { key: '/diagnostics', label: t('app.menu.diagnostics'), icon: <ExperimentOutlined /> }
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <AppLayoutHeader
        title={t('app.title')}
        menuItems={menuItems}
        selectedKey={location.pathname}
        onNavigate={(key) => navigate(key)}
        health={{ snapshot, loading, error, onRefresh: refresh }}
      />
      <Content style={{ padding: token.paddingLG, overflow: 'auto' }}>{children}</Content>
    </Layout>
  )
}

export default AppLayout
