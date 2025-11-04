import { Card, Col, Descriptions, Row, Space, Typography } from 'antd'

import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'

interface ImportEntry {
  label: string
  value: string
}

interface HealthCardProps {
  title: string
  refreshLabel: string
  loading: boolean
  error: string | null
  snapshot: {
    version: string
    status: string
    uptimeSeconds: number
  } | null
  waiting: string
  labels: { version: string; status: string; uptime: string }
  onRefresh: () => void
}

interface DiagnosticsPageContentProps {
  importsTitle: string
  importEntries: ImportEntry[]
  healthCard: HealthCardProps
}

const DiagnosticsPageContent = ({ importsTitle, importEntries, healthCard }: DiagnosticsPageContentProps) => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <SchemaSummaryCard />
      </Col>
      <Col span={12}>
        <Card title={importsTitle}>
          <Descriptions column={1} size="small">
            {importEntries.map((entry) => (
              <Descriptions.Item key={entry.label} label={entry.label}>
                {entry.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={healthCard.title}
          extra={
            <Typography.Link onClick={healthCard.onRefresh} disabled={healthCard.loading}>
              {healthCard.refreshLabel}
            </Typography.Link>
          }
          loading={healthCard.loading}
        >
          {healthCard.error ? (
            <Typography.Text type="danger">{healthCard.error}</Typography.Text>
          ) : healthCard.snapshot ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label={healthCard.labels.version}>
                {healthCard.snapshot.version}
              </Descriptions.Item>
              <Descriptions.Item label={healthCard.labels.status}>
                {healthCard.snapshot.status}
              </Descriptions.Item>
              <Descriptions.Item label={healthCard.labels.uptime}>
                {Math.round(healthCard.snapshot.uptimeSeconds)}s
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Typography.Text type="secondary">{healthCard.waiting}</Typography.Text>
          )}
        </Card>
      </Col>
    </Row>
  </Space>
)

export default DiagnosticsPageContent
