import { Card, ColorPicker, Form, Space, Typography, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { useThemeSettings } from '@renderer/theme/context'

const DEFAULT_PRIMARY = '#0ba5ec'
const DEFAULT_SECONDARY = '#10b981'

const SettingsPageContent = () => {
  const { t } = useTranslation()
  const { colors, setColors } = useThemeSettings()

  const handlePrimaryChange = (value: string) => {
    setColors({ primary: value, secondary: colors.secondary })
  }

  const handleSecondaryChange = (value: string) => {
    setColors({ primary: colors.primary, secondary: value })
  }

  const handleReset = () => {
    setColors({ primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY })
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={3}>{t('settings.title')}</Typography.Title>
      <Card title={t('settings.appearance.title')}>
        <Form layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item label={t('settings.appearance.primary')}>
            <ColorPicker
              value={colors.primary}
              onChangeComplete={(color) => handlePrimaryChange(color.toHexString())}
            />
          </Form.Item>
          <Form.Item label={t('settings.appearance.secondary')}>
            <ColorPicker
              value={colors.secondary}
              onChangeComplete={(color) => handleSecondaryChange(color.toHexString())}
            />
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
