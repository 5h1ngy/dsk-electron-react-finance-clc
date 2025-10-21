import { Card, Col, Descriptions, Row, Typography } from 'antd'

import { useHealthStatus } from '@renderer/hooks/useHealthStatus'
import { useAppSelector } from '@renderer/store/hooks'
import {
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

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
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
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}

export default DiagnosticsPage

