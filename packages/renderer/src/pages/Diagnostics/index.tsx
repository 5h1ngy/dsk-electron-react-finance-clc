import { Card, Col, Descriptions, Row, Space, Typography } from 'antd'

import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import { useDiagnosticsPage } from '@renderer/pages/Diagnostics/hooks'

const DiagnosticsPage = () => {
  const { importsTitle, importEntries, healthCard } = useDiagnosticsPage()
  const { snapshot, loading, error, refresh, waiting, labels, title, refreshLabel } = healthCard

  return (
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
            title={title}
            extra={
              <Typography.Link onClick={() => refresh()} disabled={loading}>
                {refreshLabel}
              </Typography.Link>
            }
            loading={loading}
          >
            {error ? (
              <Typography.Text type="danger">{error}</Typography.Text>
            ) : snapshot ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label={labels.version}>
                  {snapshot.version}
                </Descriptions.Item>
                <Descriptions.Item label={labels.status}>{snapshot.status}</Descriptions.Item>
                <Descriptions.Item label={labels.uptime}>
                  {Math.round(snapshot.uptimeSeconds)}s
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Typography.Text type="secondary">{waiting}</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default DiagnosticsPage
