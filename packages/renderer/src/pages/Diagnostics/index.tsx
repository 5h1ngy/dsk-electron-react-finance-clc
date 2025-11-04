import { Card, Col, Descriptions, Row, Space, Typography } from 'antd'

import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import { useHealthStatus } from '@renderer/hooks/useHealthStatus'
import { useAppSelector } from '@renderer/store/hooks'
import {
  selectCertificate,
  selectFinanceImport,
  selectPdfImport,
  selectReportExport,
  selectRequestImport
} from '@renderer/store/slices/workspace'

const DiagnosticsPage = () => {
  const { snapshot, loading, error, refresh } = useHealthStatus()
  const requestImport = useAppSelector(selectRequestImport)
  const financeImport = useAppSelector(selectFinanceImport)
  const reportExport = useAppSelector(selectReportExport)
  const pdfImport = useAppSelector(selectPdfImport)
  const certificate = useAppSelector(selectCertificate)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <SchemaSummaryCard />
        </Col>
        <Col span={12}>
          <Card title="Ultimi import">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Questionario">
                {requestImport
                  ? `${requestImport.fileName} (${requestImport.responses} risposte)`
                  : 'Nessun file caricato'}
              </Descriptions.Item>
              <Descriptions.Item label="Universe prodotti">
                {financeImport
                  ? `${financeImport.fileName} (${financeImport.instruments} strumenti)`
                  : 'Nessun file caricato'}
              </Descriptions.Item>
              <Descriptions.Item label="Questionario PDF">
                {pdfImport
                  ? `${pdfImport.fileName} (${pdfImport.pages} pagine)`
                  : 'Nessun PDF importato'}
              </Descriptions.Item>
              <Descriptions.Item label="Report PDF">
                {reportExport
                  ? `${reportExport.fileName} (${new Date(reportExport.exportedAt).toLocaleString()})`
                  : 'Nessun export effettuato'}
              </Descriptions.Item>
              <Descriptions.Item label="Hash report">
                {reportExport?.sha256 ?? 'N/D'}
              </Descriptions.Item>
              <Descriptions.Item label="File SHA-256">
                {reportExport?.hashPath ?? 'N/D'}
              </Descriptions.Item>
              <Descriptions.Item label="Manifest">
                {reportExport?.manifestPath ?? 'N/D'}
              </Descriptions.Item>
              <Descriptions.Item label="Certificato">
                {certificate
                  ? `${certificate.fileName}${
                      certificate.summary
                        ? ` (${certificate.summary.subject})`
                        : ' (in attesa verifica)'
                    }`
                  : 'Nessun certificato caricato'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Health"
            extra={
              <Typography.Link onClick={() => refresh()} disabled={loading}>
                Aggiorna
              </Typography.Link>
            }
            loading={loading}
          >
            {error ? (
              <Typography.Text type="danger">{error}</Typography.Text>
            ) : snapshot ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Versione">{snapshot.version}</Descriptions.Item>
                <Descriptions.Item label="Stato">{snapshot.status}</Descriptions.Item>
                <Descriptions.Item label="Uptime">
                  {Math.round(snapshot.uptimeSeconds)}s
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Typography.Text type="secondary">In attesa di risposta...</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default DiagnosticsPage

