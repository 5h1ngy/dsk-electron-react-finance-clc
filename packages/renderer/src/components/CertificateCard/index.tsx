import { SafetyCertificateOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Space,
  Typography,
  Upload,
  message
} from 'antd'
import type { UploadProps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { arrayBufferToBase64, extractCertificateSummary } from '@renderer/domain/signature'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { selectCertificate, setCertificate } from '@renderer/store/slices/workspace'

const readFileBase64 = (file: File, translate: (key: string) => string): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(translate('certificate.messages.fileRead')))
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(arrayBufferToBase64(reader.result))
      } else {
        reject(new Error(translate('certificate.messages.unsupported')))
      }
    }
    reader.readAsArrayBuffer(file)
  })

const CertificateCard = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const certificate = useAppSelector(selectCertificate)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const base64 = await readFileBase64(file, t)
      dispatch(
        setCertificate({
          fileName: file.name,
          loadedAt: new Date().toISOString(),
          base64
        })
      )
      message.success(t('certificate.messages.uploaded'))
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('certificate.messages.uploadError'))
    }
    return Upload.LIST_IGNORE
  }

  const handleVerify = async () => {
    if (!certificate) {
      return
    }
    if (!password) {
      message.warning(t('certificate.messages.passwordMissing'))
      return
    }
    setVerifying(true)
    try {
      const summary = extractCertificateSummary(certificate.base64, password)
      dispatch(setCertificate({ ...certificate, summary }))
      message.success(t('certificate.messages.verified'))
      setVerifyModalOpen(false)
      setPassword('')
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('certificate.messages.verifyError'))
    } finally {
      setVerifying(false)
    }
  }

  const handleClear = () => {
    dispatch(setCertificate(undefined))
    setPassword('')
    message.info(t('certificate.messages.removed'))
  }

  const summary = certificate?.summary

  return (
    <>
      <Card
        title={t('certificate.title')}
        size="small"
        extra={
          certificate ? (
            <Space>
              <Button size="small" onClick={() => setVerifyModalOpen(true)}>
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
          <Upload
            multiple={false}
            beforeUpload={handleUpload}
            showUploadList={false}
            accept=".p12,.pfx"
          >
            <Button icon={<SafetyCertificateOutlined />}>
              {certificate ? t('certificate.buttons.replace') : t('certificate.buttons.upload')}
            </Button>
          </Upload>
          {certificate ? (
            <>
              <Alert
                type={summary ? 'success' : 'warning'}
                showIcon
                message={
                  summary ? t('certificate.alert.ready') : t('certificate.alert.locked')
                }
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
            <Typography.Text type="secondary">
              {t('certificate.metadata.empty')}
            </Typography.Text>
          )}
        </Space>
      </Card>
      <Modal
        open={verifyModalOpen}
        title={t('certificate.modal.title')}
        onCancel={() => {
          setVerifyModalOpen(false)
          setPassword('')
        }}
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
}

export default CertificateCard
