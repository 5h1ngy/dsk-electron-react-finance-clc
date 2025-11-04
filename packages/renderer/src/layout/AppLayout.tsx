import { AppstoreOutlined, BankOutlined, SettingOutlined } from '@ant-design/icons'
import { Layout, Menu, Space, Typography, theme } from 'antd'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import AppLayoutHeader from '@renderer/layout/AppLayout.Header'

const { Sider, Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const siderPadding = collapsed ? token.paddingSM : token.paddingLG
  const containerPaddingX = token.marginMD
  const containerPaddingY = token.marginSM

  const menuItems = useMemo(
    () => [
      { key: '/', label: t('app.menu.workbench'), icon: <BankOutlined /> },
      { key: '/prodotti', label: t('app.menu.products'), icon: <AppstoreOutlined /> },
      { key: '/impostazioni', label: t('app.menu.settings'), icon: <SettingOutlined /> }
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

  const tabKey = new URLSearchParams(location.search).get('tab') ?? 'questionnaire'

  const breadcrumbItems = useMemo(() => {
    const rootItem = {
      title: (
        <Typography.Title level={4} style={{ margin: 0 }}>
          {t('app.menu.workbench')}
        </Typography.Title>
      ),
      onClick: () => {
        if (location.pathname !== '/' || tabKey !== 'questionnaire') {
          navigate('/')
        }
      }
    }

    if (location.pathname === '/') {
      const tabMap: Record<string, string> = {
        questionnaire: t('profilation.tabs.questionnaire'),
        suggestions: t('profilation.tabs.suggestions'),
        risk: t('profilation.tabs.risk'),
        settings: t('profilation.tabs.settings')
      }

      if (tabKey !== 'questionnaire' && tabMap[tabKey]) {
        return [
          rootItem,
          {
            title: <Typography.Text>{tabMap[tabKey]}</Typography.Text>,
            onClick: () => navigate(tabKey === 'questionnaire' ? '/' : `/?tab=${tabKey}`)
          }
        ]
      }

      return [rootItem]
    }

    const pageMap: Record<string, { label: string; href: string }> = {
      '/prodotti': { label: t('app.menu.products'), href: '/prodotti' },
      '/impostazioni': { label: t('app.menu.settings'), href: '/impostazioni' }
    }
    const entry = pageMap[location.pathname]

    if (!entry) {
      return [rootItem]
    }

    return [
      rootItem,
      {
        title: <Typography.Text>{entry.label}</Typography.Text>,
        onClick: () => navigate(entry.href)
      }
    ]
  }, [location.pathname, navigate, tabKey, t])

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout, overflow: 'hidden' }}>
      <Layout
        style={{
          display: 'flex',
          gap: containerPaddingX,
          padding: `${containerPaddingY}px ${containerPaddingX}`,
          background: 'transparent',
          minHeight: '100vh'
        }}
      >
        <Sider
          breakpoint="lg"
          width={260}
          collapsedWidth={92}
          collapsed={collapsed}
          trigger={null}
          onBreakpoint={(broken) => setCollapsed(broken)}
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            padding: siderPadding,
            height: `calc(100vh - ${containerPaddingY * 2}px)`,
            boxShadow: token.boxShadowSecondary,
            transition: 'all 0.3s ease',
            position: 'sticky',
            top: containerPaddingY,
            alignSelf: 'flex-start',
            overflow: 'auto'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%', height: '100%', display: 'flex' }}>
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
              style={{ border: 'none', flex: 1 }}
            />
          </Space>
        </Sider>
        <Layout
          style={{
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginXS,
            flex: 1,
            minHeight: 0
          }}
        >
          <AppLayoutHeader
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
            breadcrumbItems={breadcrumbItems}
            toggleLabel={collapsed ? t('layout.expand') : t('layout.collapse')}
          />
          <Content
            style={{
              padding: `${token.paddingXS}px ${token.paddingMD}px ${token.paddingMD}px`,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout
