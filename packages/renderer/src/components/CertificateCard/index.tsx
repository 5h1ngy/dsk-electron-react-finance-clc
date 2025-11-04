import { SafetyCertificateOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Space,
  Typography,
  Upload
} from 'antd'
import type { UploadProps } from 'antd'
import { useState } from 'react'

import { arrayBufferToBase64, extractCertificateSummary } from '@renderer/domain/signature'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { selectCertificate, setCertificate } from '@renderer/store/slices/workspace'

const readFileBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato'))
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(arrayBufferToBase64(reader.result))
      } else {
        reject(new Error('Formato del file non supportato'))
      }
    }
    reader.readAsArrayBuffer(file)
  })

const CertificateCard = () => {
  const dispatch = useAppDispatch()
  const certificate = useAppSelector(selectCertificate)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const base64 = await readFileBase64(file)
      dispatch(
        setCertificate({
          fileName: file.name,
          loadedAt: new Date().toISOString(),
          base64
        })
      )
      message.success('Certificato caricato. Verifica la password per leggere i metadati.')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Impossibile caricare il certificato'
      )
    }
    return Upload.LIST_IGNORE
  }

  const handleVerify = async () => {
    if (!certificate) {
      return
    }
    if (!password) {
      message.warning('Inserisci la password del certificato.')
      return
    }
    setVerifying(true)
    try {
      const summary = extractCertificateSummary(certificate.base64, password)
      dispatch(setCertificate({ ...certificate, summary }))
      message.success('Certificato verificato e metadati disponibili.')
      setVerifyModalOpen(false)
      setPassword('')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Verifica certificato non riuscita'
      )
    } finally {
      setVerifying(false)
    }
  }

  const handleClear = () => {
    dispatch(setCertificate(undefined))
    setPassword('')
    message.info('Certificato rimosso dalla sessione.')
  }

  const summary = certificate?.summary

  return (
    <>
      <Card
        title="Certificato firma digitale"
        size="small"
        extra={
          certificate ? (
            <Space>
              <Button size="small" onClick={() => setVerifyModalOpen(true)}>
                Verifica password
              </Button>
              <Button danger size="small" onClick={handleClear}>
                Rimuovi
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
              {certificate ? 'Sostituisci certificato' : 'Carica certificato .p12/.pfx'}
            </Button>
          </Upload>
          {certificate ? (
            <>
              <Alert
                type={summary ? 'success' : 'warning'}
                showIcon
                message={
                  summary
                    ? 'Certificato pronto per la firma.'
                    : 'Inserisci la password per sbloccare il certificato.'
                }
              />
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="File">{certificate.fileName}</Descriptions.Item>
                {summary ? (
                  <>
                    <Descriptions.Item label="Soggetto">{summary.subject}</Descriptions.Item>
                    <Descriptions.Item label="Emittente">{summary.issuer}</Descriptions.Item>
                    <Descriptions.Item label="Seriale">{summary.serialNumber}</Descriptions.Item>
                    <Descriptions.Item label="Validità">
                      {new Date(summary.notBefore).toLocaleDateString()} →{' '}
                      {new Date(summary.notAfter).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thumbprint SHA-1">
                      {summary.thumbprint}
                    </Descriptions.Item>
                  </>
                ) : (
                  <Descriptions.Item label="Metadati">
                    In attesa di verifica password.
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          ) : (
            <Typography.Text type="secondary">
              Nessun certificato importato. Il file resta solo in memoria e verrà usato per firmare i
              PDF della sessione.
            </Typography.Text>
          )}
        </Space>
      </Card>
      <Modal
        open={verifyModalOpen}
        title="Verifica certificato"
        onCancel={() => {
          setVerifyModalOpen(false)
          setPassword('')
        }}
        onOk={handleVerify}
        okText="Verifica"
        confirmLoading={verifying}
        destroyOnClose
      >
        <Typography.Paragraph>
          Inserisci la password associata al file{' '}
          <Typography.Text strong>{certificate?.fileName}</Typography.Text> per leggere i metadati.
        </Typography.Paragraph>
        <Input.Password
          placeholder="Password certificato"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />
      </Modal>
    </>
  )
}

export default CertificateCard
