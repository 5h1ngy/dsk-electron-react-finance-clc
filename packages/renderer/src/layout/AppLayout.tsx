import { BankOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Layout, Menu, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { HealthStatusTag } from '@renderer/components/HealthStatus'
import { useHealthStatus } from '@renderer/hooks/useHealthStatus'

const { Header, Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

const menuItems = [
  { key: '/', label: 'Workbench', icon: <BankOutlined /> },
  { key: '/diagnostics', label: 'Diagnostics', icon: <ExperimentOutlined /> }
]

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { snapshot, loading, error, refresh } = useHealthStatus()

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
            Offline Risk Suite
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
      <Content style={{ padding: 24, overflow: 'auto' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default AppLayout
