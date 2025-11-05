import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Space, Tag, Tooltip, Typography, theme } from 'antd'
import { useTranslation } from 'react-i18next'

import type { HealthSnapshot } from '@main/ipc/health'

interface StatusTagProps {
  snapshot: HealthSnapshot | null
  loading: boolean
  error: string | null
  onRefresh: () => void
  tone?: 'light' | 'dark'
}

const HealthStatusTag = ({
  snapshot,
  loading,
  error,
  onRefresh,
  tone = 'light'
}: StatusTagProps) => {
  const { t } = useTranslation()
  const { token } = theme.useToken()

  const darkSuccessBg = token.colorSuccessBgHover ?? token.colorSuccessBg
  const darkErrorBg = token.colorErrorBgHover ?? token.colorErrorBg

  const palette =
    tone === 'dark'
      ? {
          tagSuccess: {
            backgroundColor: darkSuccessBg,
            color: token.colorWhite,
            border: 'none' as const
          },
          tagError: {
            backgroundColor: darkErrorBg,
            color: token.colorWhite,
            border: 'none' as const
          },
          text: token.colorTextLightSolid,
          refresh: token.colorTextLightSolid
        }
      : {
          tagSuccess: { backgroundColor: token.colorSuccessBg, color: token.colorSuccessText },
          tagError: { backgroundColor: token.colorErrorBg, color: token.colorErrorText },
          text: token.colorTextSecondary,
          refresh: token.colorTextSecondary
        }

  if (error) {
    return (
      <Space>
        <Tag style={palette.tagError}>{t('health.status.offline')}</Tag>
        <Button
          type="text"
          icon={<ReloadOutlined style={{ color: palette.refresh }} />}
          onClick={onRefresh}
          loading={loading}
          aria-label={t('health.status.retryAria')}
          style={{ color: palette.refresh }}
        />
      </Space>
    )
  }

  if (!snapshot) {
    return <Tag color="default">{t('health.status.loading')}</Tag>
  }

  return (
    <Space size="small">
      <Tag style={palette.tagSuccess}>{t('health.status.healthy')}</Tag>
      <Tooltip title={t('health.status.version', { version: snapshot.version })}>
        <Typography.Text style={{ color: palette.text }}>
          <ClockCircleOutlined /> {new Date(snapshot.timestamp).toLocaleTimeString()}
        </Typography.Text>
      </Tooltip>
      <Button
        type="text"
        icon={<ReloadOutlined style={{ color: palette.refresh }} />}
        onClick={onRefresh}
        loading={loading}
        aria-label={t('health.status.refreshAria')}
        style={{ color: palette.refresh }}
      />
    </Space>
  )
}

export default HealthStatusTag
