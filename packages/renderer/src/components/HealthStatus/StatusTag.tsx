import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Space, Tag, Tooltip, Typography } from 'antd'

import type { HealthSnapshot } from '@main/ipc/health'

interface StatusTagProps {
  snapshot: HealthSnapshot | null
  loading: boolean
  error: string | null
  onRefresh: () => void
}

const HealthStatusTag = ({ snapshot, loading, error, onRefresh }: StatusTagProps) => {
  if (error) {
    return (
      <Space>
        <Tag color="error">Offline</Tag>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          aria-label="Riprova health check"
        />
      </Space>
    )
  }

  if (!snapshot) {
    return <Tag color="default">Health check...</Tag>
  }

  return (
    <Space size="small">
      <Tag color="success">Healthy</Tag>
      <Tooltip title={`Versione ${snapshot.version}`}>
        <Typography.Text type="secondary">
          <ClockCircleOutlined /> {new Date(snapshot.timestamp).toLocaleTimeString()}
        </Typography.Text>
      </Tooltip>
      <Button
        type="text"
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
        aria-label="Aggiorna health check"
      />
    </Space>
  )
}

export default HealthStatusTag
