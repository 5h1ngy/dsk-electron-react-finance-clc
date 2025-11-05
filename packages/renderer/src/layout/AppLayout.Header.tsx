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
            type="default"
            size="large"
            shape="circle"
            onClick={onToggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            aria-label={toggleLabel}
            style={{
              width: 44,
              height: 44,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
