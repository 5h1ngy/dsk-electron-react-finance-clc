import { AppstoreOutlined, BankOutlined, SettingOutlined } from '@ant-design/icons'
import { Layout, Menu, Typography, theme } from 'antd'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import AppLayoutHeader from '@renderer/layout/AppLayout.Header'
import type { EnvironmentApi } from '@preload/types'

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
  const siderSpacingX = containerPaddingX / 2
  const stickyOffset = containerPaddingY
  const stickyHeight = `calc(100vh - ${stickyOffset * 2}px)`

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
  const rendererWindow = window as typeof window & {
    environment?: EnvironmentApi
    api?: { environment?: EnvironmentApi }
  }
  const environmentInfo = rendererWindow.environment ?? rendererWindow.api?.environment ?? undefined

  const showVersionBadge = Boolean(environmentInfo?.enableDevtools)
  const versionText = environmentInfo?.appVersion ? `v${environmentInfo.appVersion}` : undefined

  const breadcrumbItems = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const basePath = segments.length ? `/${segments[0]}` : '/'
    const pageMap: Record<string, { label: string; href: string }> = {
      '/': { label: t('app.menu.workbench'), href: '/' },
      '/prodotti': { label: t('app.menu.products'), href: '/prodotti' },
      '/impostazioni': { label: t('app.menu.settings'), href: '/impostazioni' }
    }
    const currentPage = pageMap[basePath] ?? pageMap['/']

    const items = [
      {
        title: (
          <Typography.Title level={4} style={{ margin: 0 }}>
            {currentPage.label}
          </Typography.Title>
        ),
        onClick:
          location.pathname !== currentPage.href ? () => navigate(currentPage.href) : undefined
      }
    ]

    if (currentPage.href === '/') {
      const tabMap: Record<
        string,
        { label: string; href: string }
      > = {
        questionnaire: { label: t('profilation.tabs.questionnaire'), href: '/' },
        results: { label: t('profilation.tabs.risk'), href: '/?tab=results' },
        suggestions: { label: t('profilation.tabs.suggestions'), href: '/?tab=suggestions' },
        risk: { label: t('profilation.tabs.risk'), href: '/?tab=risk' },
        settings: { label: t('profilation.tabs.settings'), href: '/?tab=settings' }
      }

      const currentTab = tabMap[tabKey] ?? tabMap.questionnaire
      const currentLocation = `${location.pathname}${location.search}`

      items.push({
        title: <Typography.Text>{currentTab.label}</Typography.Text>,
        onClick:
          currentTab.href !== currentLocation
            ? () => navigate(currentTab.href)
            : undefined
      })
    }

    return items
  }, [location.pathname, navigate, tabKey, t])

  return (
    <Layout style={{ height: '100vh', background: token.colorBgLayout, overflow: 'hidden' }}>
      <Layout
        style={{
          display: 'flex',
          gap: containerPaddingX,
          padding: `${containerPaddingY}px ${containerPaddingX}`,
          background: 'transparent',
          height: '100%'
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
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            padding: `${containerPaddingY}px ${siderSpacingX}px`,
            boxSizing: 'border-box',
            overflow: 'visible'
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: stickyOffset,
              height: stickyHeight,
              minHeight: stickyHeight,
              display: 'flex',
              flexDirection: 'column',
              zIndex: token.zIndexBase + 1
            }}
          >
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                padding: siderPadding,
                boxShadow: token.boxShadowSecondary,
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden'
                }}
              >
                <Menu
                  mode="inline"
                  selectedKeys={selectedKeys}
                  items={menuItems}
                  onClick={({ key }) => navigate(key)}
                  style={{
                    border: 'none',
                    flex: 1,
                    overflowY: 'auto',
                    marginTop: token.marginMD
                  }}
                />
                {showVersionBadge && versionText && (
                  <div
                    style={{
                      marginTop: 'auto',
                      background: token.colorFillQuaternary,
                      borderRadius: token.borderRadiusLG,
                      padding: token.paddingSM,
                      textAlign: 'center',
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${token.colorBorderSecondary}`
                    }}
                  >
                    <Typography.Text
                      style={{
                        color: token.colorText,
                        fontSize: token.fontSizeSM,
                        fontWeight: 600,
                        letterSpacing: 0.5
                      }}
                    >
                      {versionText}
                    </Typography.Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Sider>
        <Layout
          style={{
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginXS,
            flex: 1,
            minHeight: 0,
            height: '100%',
            overflow: 'hidden'
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
