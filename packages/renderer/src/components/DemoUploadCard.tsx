import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons'
import { Card, List, Typography, Upload } from 'antd'

import { useDemoUploadCard } from '@renderer/components/DemoUploadCard.hooks'

const { Dragger } = Upload

const DemoUploadCard = () => {
  const {
    copy,
    listItems,
    handleQuestionnaireUpload,
    handleFinanceUpload,
    handlePdfUpload
  } = useDemoUploadCard()

  return (
    <Card title={copy.title} style={{ height: '100%' }}>
      <Typography.Paragraph type="secondary">{copy.description}</Typography.Paragraph>
      <Dragger multiple={false} beforeUpload={handleQuestionnaireUpload} accept=".xlsx,.xls" showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{copy.drop.questionnaire.title}</p>
        <p className="ant-upload-hint">{copy.drop.questionnaire.hint}</p>
      </Dragger>
      <Dragger
        multiple={false}
        beforeUpload={handleFinanceUpload}
        accept=".xlsx,.xls"
        showUploadList={false}
        style={{ marginTop: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{copy.drop.products.title}</p>
        <p className="ant-upload-hint">{copy.drop.products.hint}</p>
      </Dragger>
      <Dragger
        multiple={false}
        beforeUpload={handlePdfUpload}
        accept=".pdf"
        showUploadList={false}
        style={{ marginTop: 16, borderStyle: 'dashed' }}
      >
        <p className="ant-upload-drag-icon">
          <FilePdfOutlined />
        </p>
        <p className="ant-upload-text">{copy.drop.pdf.title}</p>
        <p className="ant-upload-hint">{copy.drop.pdf.hint}</p>
      </Dragger>
      <List
        size="small"
        header={<Typography.Text strong>{copy.listTitle}</Typography.Text>}
        dataSource={listItems}
        style={{ marginTop: 16 }}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  )
}

export default DemoUploadCard
