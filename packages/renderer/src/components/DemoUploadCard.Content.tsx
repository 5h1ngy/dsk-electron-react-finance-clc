import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons'
import { Alert, Card, Descriptions, Space, Tag, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface DemoUploadCardContentProps {
  copy: {
    title: string
    description: string
    drop: {
      products: { title: string; hint: string }
      pdf: { title: string; hint: string }
    }
    status: {
      idle: string
    }
    labels: {
      products: string
      pdf: string
    }
    empty: {
      products: string
      pdf: string
    }
  }
  status: { type: 'success' | 'error'; message: string } | null
  handleFinanceUpload: UploadProps['beforeUpload']
  handlePdfUpload: UploadProps['beforeUpload']
  financeImport?: {
    fileName: string
    importedAt: string
    instruments: number
    categories: Array<{ name: string; count: number }>
  }
  pdfImport?: {
    fileName: string
    importedAt: string
    pages: number
  }
}

const DemoUploadCardContent = ({
  copy,
  status,
  handleFinanceUpload,
  handlePdfUpload,
  financeImport,
  pdfImport
}: DemoUploadCardContentProps) => (
  <Card title={copy.title}>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        {copy.description}
      </Typography.Paragraph>
      {status ? (
        <Alert type={status.type} message={status.message} showIcon style={{ marginBottom: 0 }} />
      ) : (
        <Alert type="info" message={copy.status.idle} showIcon />
      )}
      <Dragger
        multiple={false}
        beforeUpload={handleFinanceUpload}
        accept=".xlsx,.xls"
        showUploadList={false}
      >
        <Typography.Paragraph className="ant-upload-drag-icon" style={{ marginBottom: 0 }}>
          <InboxOutlined />
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-text" style={{ marginBottom: 0 }}>
          {copy.drop.products.title}
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-hint" style={{ marginBottom: 0 }}>
          {copy.drop.products.hint}
        </Typography.Paragraph>
      </Dragger>
      <Dragger multiple={false} beforeUpload={handlePdfUpload} accept=".pdf" showUploadList={false}>
        <Typography.Paragraph className="ant-upload-drag-icon" style={{ marginBottom: 0 }}>
          <FilePdfOutlined />
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-text" style={{ marginBottom: 0 }}>
          {copy.drop.pdf.title}
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-hint" style={{ marginBottom: 0 }}>
          {copy.drop.pdf.hint}
        </Typography.Paragraph>
      </Dragger>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label={copy.labels.products}>
          {financeImport ? (
            <Space size="small">
              <Tag color="processing">{financeImport.fileName}</Tag>
              <Typography.Text type="secondary">
                {new Date(financeImport.importedAt).toLocaleString()}
              </Typography.Text>
            </Space>
          ) : (
            <Typography.Text type="secondary">{copy.empty.products}</Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={copy.labels.pdf}>
          {pdfImport ? (
            <Space size="small">
              <Tag color="success">{pdfImport.fileName}</Tag>
              <Typography.Text type="secondary">
                {new Date(pdfImport.importedAt).toLocaleString()}
              </Typography.Text>
            </Space>
          ) : (
            <Typography.Text type="secondary">{copy.empty.pdf}</Typography.Text>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Space>
  </Card>
)

export default DemoUploadCardContent
