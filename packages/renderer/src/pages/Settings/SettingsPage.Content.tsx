import { Button, Card, Form, Space, Switch, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useThemeSettings } from '@renderer/theme/context'
import { DEFAULT_SECONDARY, LIGHT_PRIMARY } from '@renderer/theme'

const SECONDARY_OPTIONS = ['#10b981', '#f97316', '#6366f1', '#ec4899', '#14b8a6']

const SettingsPageContent = () => {
  const { t } = useTranslation()
  const { colors, setColors, mode, setMode } = useThemeSettings()

  const handleReset = () => {
    setMode('light')
    setColors({ primary: LIGHT_PRIMARY, secondary: DEFAULT_SECONDARY })
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Form layout="vertical" style={{ maxWidth: 520 }}>
          <Form.Item label={t('settings.appearance.mode')}>
            <Space size="middle">
              <Typography.Text strong>{mode === 'dark' ? t('settings.appearance.dark') : t('settings.appearance.light')}</Typography.Text>
              <Switch
                checked={mode === 'dark'}
                onChange={(value) => setMode(value ? 'dark' : 'light')}
                checkedChildren={t('settings.appearance.darkShort')}
                unCheckedChildren={t('settings.appearance.lightShort')}
              />
            </Space>
          </Form.Item>
          <Form.Item label={t('settings.appearance.secondaryPalette')}>
            <Space size="middle" wrap>
              {SECONDARY_OPTIONS.map((option) => (
                <Button
                  key={option}
                  shape="circle"
                  type={colors.secondary === option ? 'primary' : 'default'}
                  style={{
                    width: 36,
                    height: 36,
                    background: option,
                    borderColor: option,
                    boxShadow:
                      colors.secondary === option
                        ? '0 0 0 3px rgba(15, 23, 42, 0.18)'
                        : '0 0 0 1px rgba(148, 163, 184, 0.25)'
                  }}
                  aria-pressed={colors.secondary === option}
                  onClick={() => setColors({ primary: colors.primary, secondary: option })}
                />
              ))}
            </Space>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset}>{t('settings.appearance.reset')}</Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  )
}

export default SettingsPageContent
