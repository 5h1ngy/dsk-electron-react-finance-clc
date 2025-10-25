import { BankOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Layout, Menu, Space, Typography } from 'antd'
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

  const menuItems = [
    { key: '/', label: t('app.menu.workbench'), icon: <BankOutlined /> },
    { key: '/diagnostics', label: t('app.menu.diagnostics'), icon: <ExperimentOutlined /> }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          paddingInline: 32,
          background: '#041529'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, minWidth: 0 }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            {t('app.title')}
          </Typography.Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(String(key))}
            style={{ borderBottom: 'none', background: 'transparent', flex: 1, minWidth: 0 }}
            overflowedIndicator={null}
          />
        </div>
        <Space>
          <HealthStatusTag
            snapshot={snapshot}
            loading={loading}
            error={error}
            onRefresh={refresh}
            tone="dark"
          />
        </Space>
      </Header>
      <Content style={{ padding: 24, overflow: 'auto' }}>{children}</Content>
    </Layout>
  )
}

export default AppLayout
