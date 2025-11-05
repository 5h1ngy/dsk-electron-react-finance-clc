import { SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Descriptions, Input, Modal, Space, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'
import type { TFunction } from 'i18next'

import type { CertificateSummary, LoadedCertificate } from '@engines/signature'

const { Dragger } = Upload

interface CertificateCardContentProps {
  t: TFunction
  certificate: LoadedCertificate | undefined
  summary: CertificateSummary | undefined
  verifyModalOpen: boolean
  password: string
  verifying: boolean
  handleUpload: UploadProps['beforeUpload']
  handleVerify: () => Promise<void>
  handleClear: () => void
  openVerifyModal: () => void
  closeVerifyModal: () => void
  setPassword: (value: string) => void
}

const CertificateCardContent = ({
  t,
  certificate,
  summary,
  verifyModalOpen,
  password,
  verifying,
  handleUpload,
  handleVerify,
  handleClear,
  openVerifyModal,
  closeVerifyModal,
  setPassword
}: CertificateCardContentProps) => (
  <>
    <Card
      title={t('certificate.title')}
      size="small"
      extra={
        certificate ? (
          <Space>
            <Button size="small" onClick={openVerifyModal}>
              {t('certificate.buttons.verify')}
            </Button>
            <Button danger size="small" onClick={handleClear}>
              {t('certificate.buttons.remove')}
            </Button>
          </Space>
        ) : null
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Dragger
          multiple={false}
          beforeUpload={handleUpload}
          showUploadList={false}
          accept=".p12,.pfx"
        >
          <Button icon={<SafetyCertificateOutlined />}>
            {certificate ? t('certificate.buttons.replace') : t('certificate.buttons.upload')}
          </Button>
        </Dragger>
        {certificate ? (
          <>
            <Alert
              type={summary ? 'success' : 'warning'}
              showIcon
              message={summary ? t('certificate.alert.ready') : t('certificate.alert.locked')}
            />
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label={t('certificate.labels.file')}>
                {certificate.fileName}
              </Descriptions.Item>
              {summary ? (
                <>
                  <Descriptions.Item label={t('certificate.labels.subject')}>
                    {summary.subject}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('certificate.labels.issuer')}>
                    {summary.issuer}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('certificate.labels.serial')}>
                    {summary.serialNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('certificate.labels.validity')}>
                    {t('certificate.validityRange', {
                      start: new Date(summary.notBefore).toLocaleDateString(),
                      end: new Date(summary.notAfter).toLocaleDateString()
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('certificate.labels.thumbprint')}>
                    {summary.thumbprint}
                  </Descriptions.Item>
                </>
              ) : (
                <Descriptions.Item label={t('certificate.labels.metadata')}>
                  {t('certificate.metadata.pending')}
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        ) : (
          <Typography.Text type="secondary">{t('certificate.metadata.empty')}</Typography.Text>
        )}
      </Space>
    </Card>
    <Modal
      open={verifyModalOpen}
      title={t('certificate.modal.title')}
      onCancel={closeVerifyModal}
      onOk={handleVerify}
      okText={t('certificate.modal.confirm')}
      confirmLoading={verifying}
      destroyOnClose
    >
      <Typography.Paragraph>
        {t('certificate.modal.description', {
          file: certificate?.fileName ?? 'P12'
        })}
      </Typography.Paragraph>
      <Input.Password
        placeholder={t('certificate.modal.placeholder')}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoFocus
      />
    </Modal>
  </>
)

export default CertificateCardContent
