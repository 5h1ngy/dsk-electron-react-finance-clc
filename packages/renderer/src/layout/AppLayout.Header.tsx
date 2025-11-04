import { Flex, Layout, Menu, Typography } from 'antd'
import type { ReactNode } from 'react'
import type { HealthSnapshot } from '@main/ipc/health'

import { HealthStatusTag } from '@renderer/components/HealthStatus'

const { Header } = Layout

interface MenuItem {
  key: string
  label: string
  icon: ReactNode
}

interface HealthProps {
  snapshot: HealthSnapshot | null
  loading: boolean
  error: string | null
  onRefresh: () => void
}

interface AppLayoutHeaderProps {
  title: string
  menuItems: MenuItem[]
  selectedKey: string
  onNavigate: (key: string) => void
  health: HealthProps
}

const AppLayoutHeader = ({ title, menuItems, selectedKey, onNavigate, health }: AppLayoutHeaderProps) => (
  <Header>
    <Flex align="center" justify="space-between" gap="large">
      <Flex align="center" gap="large" style={{ flex: 1, minWidth: 0 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems.map((item) => ({ ...item, icon: item.icon }))}
          onClick={({ key }) => onNavigate(String(key))}
          style={{ flex: 1, minWidth: 0 }}
          overflowedIndicator={null}
        />
      </Flex>
      <HealthStatusTag
        snapshot={health.snapshot}
        loading={health.loading}
        error={health.error}
        onRefresh={health.onRefresh}
        tone="dark"
      />
    </Flex>
  </Header>
)

export default AppLayoutHeader
