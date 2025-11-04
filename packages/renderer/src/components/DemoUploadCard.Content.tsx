import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons'
import { Card, List, Space, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface DemoUploadCardContentProps {
  copy: {
    title: string
    description: string
    drop: {
      questionnaire: { title: string; hint: string }
      products: { title: string; hint: string }
      pdf: { title: string; hint: string }
    }
    listTitle: string
  }
  listItems: string[]
  handleQuestionnaireUpload: UploadProps['beforeUpload']
  handleFinanceUpload: UploadProps['beforeUpload']
  handlePdfUpload: UploadProps['beforeUpload']
}

const DemoUploadCardContent = ({
  copy,
  listItems,
  handleQuestionnaireUpload,
  handleFinanceUpload,
  handlePdfUpload
}: DemoUploadCardContentProps) => (
  <Card title={copy.title}>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        {copy.description}
      </Typography.Paragraph>
      <Dragger
        multiple={false}
        beforeUpload={handleQuestionnaireUpload}
        accept=".xlsx,.xls"
        showUploadList={false}
      >
        <Typography.Paragraph className="ant-upload-drag-icon" style={{ marginBottom: 0 }}>
          <InboxOutlined />
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-text" style={{ marginBottom: 0 }}>
          {copy.drop.questionnaire.title}
        </Typography.Paragraph>
        <Typography.Paragraph className="ant-upload-hint" style={{ marginBottom: 0 }}>
          {copy.drop.questionnaire.hint}
        </Typography.Paragraph>
      </Dragger>
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
      <List
        size="small"
        header={<Typography.Text strong>{copy.listTitle}</Typography.Text>}
        dataSource={listItems}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Space>
  </Card>
)

export default DemoUploadCardContent
