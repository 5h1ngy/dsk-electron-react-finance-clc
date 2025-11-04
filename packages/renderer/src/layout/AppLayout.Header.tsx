import { Breadcrumb, Button, Flex, Layout, Space, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { BreadcrumbProps } from 'antd'

import { HealthStatusTag } from '@renderer/components/HealthStatus'
import type { HealthSnapshot } from '@main/ipc/health'

const { Header } = Layout

interface AppLayoutHeaderProps {
  collapsed: boolean
  onToggle: () => void
  breadcrumbItems: BreadcrumbProps['items']
  toggleLabel: string
  health: {
    snapshot: HealthSnapshot | null
    loading: boolean
    error: string | null
    onRefresh: () => void
  }
}

const AppLayoutHeader = ({ collapsed, onToggle, breadcrumbItems, toggleLabel, health }: AppLayoutHeaderProps) => {
  const { token } = theme.useToken()

  return (
    <Header
      style={{
        background: 'transparent',
        padding: 0,
        marginBottom: token.marginMD
      }}
    >
      <Flex align="center" justify="space-between">
        <Space align="center" size="middle">
          <Button
            type="text"
            onClick={onToggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            aria-label={toggleLabel}
            style={{ width: 40, height: 40 }}
          />
          <Breadcrumb items={breadcrumbItems} />
        </Space>
        <HealthStatusTag
          snapshot={health.snapshot}
          loading={health.loading}
          error={health.error}
          onRefresh={health.onRefresh}
          tone="light"
        />
      </Flex>
    </Header>
  )
}

export default AppLayoutHeader
