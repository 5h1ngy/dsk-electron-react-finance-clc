import { Breadcrumb, Button, Flex, Layout, Space, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { BreadcrumbProps } from 'antd'

const { Header } = Layout

interface AppLayoutHeaderProps {
  collapsed: boolean
  onToggle: () => void
  breadcrumbItems: BreadcrumbProps['items']
  toggleLabel: string
}

const AppLayoutHeader = ({ collapsed, onToggle, breadcrumbItems, toggleLabel }: AppLayoutHeaderProps) => {
  const { token } = theme.useToken()

  return (
    <Header
      style={{
        background: 'transparent',
        padding: 0,
        marginBottom: token.marginXS
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
          <Breadcrumb
            items={breadcrumbItems}
            style={{ display: 'flex', alignItems: 'center' }}
          />
        </Space>
      </Flex>
    </Header>
  )
}

export default AppLayoutHeader
