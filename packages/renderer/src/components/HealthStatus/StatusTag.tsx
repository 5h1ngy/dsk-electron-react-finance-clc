import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Space, Tag, Tooltip, Typography } from 'antd'

import type { HealthSnapshot } from '@main/ipc/health'

interface StatusTagProps {
  snapshot: HealthSnapshot | null
  loading: boolean
  error: string | null
  onRefresh: () => void
  tone?: 'light' | 'dark'
}

const tonePalette = {
  light: {
    tagSuccess: { backgroundColor: '#f0fff4', color: '#15803d' },
    tagError: { backgroundColor: '#fef2f2', color: '#b91c1c' },
    text: '#475467',
    refresh: '#475467'
  },
  dark: {
    tagSuccess: {
      backgroundColor: 'rgba(34,197,94,0.12)',
      color: '#e4ffe5',
      border: 'none' as const
    },
    tagError: {
      backgroundColor: 'rgba(248,113,113,0.16)',
      color: '#ffe2e5',
      border: 'none' as const
    },
    text: '#e2e8f0',
    refresh: '#e2e8f0'
  }
}

const HealthStatusTag = ({ snapshot, loading, error, onRefresh, tone = 'light' }: StatusTagProps) => {
  const palette = tonePalette[tone]

  if (error) {
    return (
      <Space>
        <Tag style={palette.tagError}>Offline</Tag>
        <Button
          type="text"
          icon={<ReloadOutlined style={{ color: palette.refresh }} />}
          onClick={onRefresh}
          loading={loading}
          aria-label="Riprova health check"
          style={{ color: palette.refresh }}
        />
      </Space>
    )
  }

  if (!snapshot) {
    return <Tag color="default">Health check...</Tag>
  }

  return (
    <Space size="small">
      <Tag style={palette.tagSuccess}>Healthy</Tag>
      <Tooltip title={`Versione ${snapshot.version}`}>
        <Typography.Text style={{ color: palette.text }}>
          <ClockCircleOutlined /> {new Date(snapshot.timestamp).toLocaleTimeString()}
        </Typography.Text>
      </Tooltip>
      <Button
        type="text"
        icon={<ReloadOutlined style={{ color: palette.refresh }} />}
        onClick={onRefresh}
        loading={loading}
        aria-label="Aggiorna health check"
        style={{ color: palette.refresh }}
      />
    </Space>
  )
}

export default HealthStatusTag
