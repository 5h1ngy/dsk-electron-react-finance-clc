import { AppstoreOutlined, BankOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Layout, Menu, Space, Typography, theme } from 'antd'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useHealthStatus } from '@renderer/hooks/useHealthStatus'
import AppLayoutHeader from '@renderer/layout/AppLayout.Header'

const { Sider, Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { snapshot, loading, error, refresh } = useHealthStatus()
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const siderPadding = collapsed ? token.paddingSM : token.paddingLG

  const menuItems = useMemo(
    () => [
      { key: '/', label: t('app.menu.workbench'), icon: <BankOutlined /> },
      { key: '/diagnostics', label: t('app.menu.diagnostics'), icon: <ExperimentOutlined /> },
      { key: '/prodotti', label: t('app.menu.products'), icon: <AppstoreOutlined /> }
    ],
    [t]
  )

  const selectedKeys = useMemo(() => {
    if (location.pathname === '/') {
      return ['/']
    }
    const [first] = location.pathname.split('/').filter(Boolean)
    return [`/${first ?? ''}`]
  }, [location.pathname])

  const breadcrumbItems = useMemo(() => {
    const mapping: Record<string, string> = {
      '/': t('app.menu.workbench'),
      '/diagnostics': t('app.menu.diagnostics'),
      '/prodotti': t('app.menu.products')
    }

    if (location.pathname === '/') {
      return [
        {
          title: mapping['/'],
          onClick: () => navigate('/')
        }
      ]
    }

    const segments = location.pathname.split('/').filter(Boolean)
    const items = [
      {
        title: mapping['/'],
        onClick: () => navigate('/')
      }
    ]
    let path = ''
    segments.forEach((segment) => {
      path += `/${segment}`
      if (mapping[path]) {
        items.push({
          title: mapping[path],
          onClick: () => navigate(path)
        })
      }
    })
    return items
  }, [location.pathname, navigate, t])

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Layout
        style={{
          display: 'flex',
          gap: token.marginLG,
          padding: token.marginLG,
          background: 'transparent'
        }}
      >
        <Sider
          width={260}
          collapsedWidth={92}
          collapsed={collapsed}
          trigger={null}
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            padding: siderPadding,
            height: '100%',
            boxShadow: token.boxShadowSecondary,
            transition: 'all 0.3s ease'
          }}
        >
          <Space
            direction="vertical"
            size="large"
            style={{ width: '100%' }}
          >
            <div
              style={{
                padding: token.paddingSM,
                borderRadius: token.borderRadiusLG,
                background: token.colorFillTertiary,
                textAlign: collapsed ? 'center' : 'left'
              }}
            >
              <Typography.Title level={collapsed ? 5 : 4} style={{ margin: 0 }}>
                {collapsed ? 'DSK' : t('app.title')}
              </Typography.Title>
            </div>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              style={{ border: 'none' }}
            />
          </Space>
        </Sider>
        <Layout
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            padding: token.paddingLG,
            boxShadow: token.boxShadowSecondary,
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginMD
          }}
        >
          <AppLayoutHeader
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
            breadcrumbItems={breadcrumbItems}
            toggleLabel={collapsed ? t('layout.expand') : t('layout.collapse')}
            health={{ snapshot, loading, error, onRefresh: refresh }}
          />
          <Content style={{ padding: 0, overflow: 'auto' }}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout
