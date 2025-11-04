import { BankOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Flex, Layout, Menu, Typography, theme } from 'antd'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { HealthStatusTag } from '@renderer/components/HealthStatus'
import { useHealthStatus } from '@renderer/hooks/useHealthStatus'

const { Header, Content } = Layout

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
      <Header>
        <Flex align="center" justify="space-between" gap="large">
          <Flex align="center" gap="large" style={{ flex: 1, minWidth: 0 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {t('app.title')}
            </Typography.Title>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(String(key))}
              style={{ flex: 1, minWidth: 0 }}
              overflowedIndicator={null}
            />
          </Flex>
          <HealthStatusTag
            snapshot={snapshot}
            loading={loading}
            error={error}
            onRefresh={refresh}
            tone="dark"
          />
        </Flex>
      </Header>
      <Content style={{ padding: token.paddingLG, overflow: 'auto' }}>{children}</Content>
    </Layout>
  )
}

export default AppLayout
