import { Card, Col, Descriptions, Row, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <SchemaSummaryCard />
        </Col>
        <Col span={12}>
          <Card title={t('diagnostics.imports.title')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('diagnostics.imports.labels.questionnaire')}>
                {requestImport
                  ? t('diagnostics.imports.values.questionnaire', {
                      file: requestImport.fileName,
                      count: requestImport.responses
                    })
                  : t('diagnostics.imports.empty.questionnaire')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.products')}>
                {financeImport
                  ? t('diagnostics.imports.values.products', {
                      file: financeImport.fileName,
                      count: financeImport.instruments
                    })
                  : t('diagnostics.imports.empty.products')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.pdf')}>
                {pdfImport
                  ? t('diagnostics.imports.values.pdf', {
                      file: pdfImport.fileName,
                      pages: pdfImport.pages
                    })
                  : t('diagnostics.imports.empty.pdf')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.report')}>
                {reportExport
                  ? t('diagnostics.imports.values.report', {
                      file: reportExport.fileName,
                      date: new Date(reportExport.exportedAt).toLocaleString()
                    })
                  : t('diagnostics.imports.empty.report')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.hash')}>
                {reportExport?.sha256 ?? t('diagnostics.imports.empty.hash')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.hashFile')}>
                {reportExport?.hashPath ?? t('diagnostics.imports.empty.hashFile')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.manifest')}>
                {reportExport?.manifestPath ?? t('diagnostics.imports.empty.manifest')}
              </Descriptions.Item>
              <Descriptions.Item label={t('diagnostics.imports.labels.certificate')}>
                {certificate
                  ? certificate.summary
                    ? t('diagnostics.imports.certificate.verified', {
                        file: certificate.fileName,
                        subject: certificate.summary.subject
                      })
                    : t('diagnostics.imports.certificate.pending', {
                        file: certificate.fileName
                      })
                  : t('diagnostics.imports.empty.certificate')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={t('health.card.title')}
            extra={
              <Typography.Link onClick={() => refresh()} disabled={loading}>
                {t('health.card.refresh')}
              </Typography.Link>
            }
            loading={loading}
          >
            {error ? (
              <Typography.Text type="danger">{error}</Typography.Text>
            ) : snapshot ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('diagnostics.health.version')}>
                  {snapshot.version}
                </Descriptions.Item>
                <Descriptions.Item label={t('diagnostics.health.status')}>
                  {snapshot.status}
                </Descriptions.Item>
                <Descriptions.Item label={t('diagnostics.health.uptime')}>
                  {Math.round(snapshot.uptimeSeconds)}s
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Typography.Text type="secondary">{t('health.card.waiting')}</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default DiagnosticsPage

