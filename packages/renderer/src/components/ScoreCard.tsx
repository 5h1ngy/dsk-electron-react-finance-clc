import { FilePdfOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  List,
  Modal,
  Progress,
  Space,
  Statistic,
  Tooltip,
  Typography,
  theme
} from 'antd'

import { useScoreCard } from '@renderer/components/ScoreCard.hooks'

const ScoreCard = () => {
  const { token } = theme.useToken()

  const {
    title,
    emptyDescription,
    score,
    statHighlights,
    metaDetails,
    notes,
    alertMessage,
    missingAnswersDescription,
    exportTooltip,
    exportLabel,
    recomputeLabel,
    notesTitle,
    modalCopy,
    passwordModalOpen,
    password,
    setPassword,
    handleRecompute,
    handleExportClick,
    handleModalClose,
    confirmExport,
    exporting,
    submitting,
    certificateFileName
  } = useScoreCard()

  if (!score) {
    return (
      <Card title={title}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Typography.Text>{emptyDescription}</Typography.Text>}
        />
      </Card>
    )
  }

  const exportDisabled = score.missingAnswers.length > 0 || exporting

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Typography.Link onClick={handleRecompute}>{recomputeLabel}</Typography.Link>
          <Tooltip title={exportTooltip}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportClick}
              disabled={exportDisabled}
              loading={exporting}
            >
              {exportLabel}
            </Button>
          </Tooltip>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Progress type="dashboard" percent={score.score} strokeColor={token.colorPrimary} />
        <Divider style={{ margin: 0 }} />
        <List size="small">
          {statHighlights.map((item) => (
            <List.Item key={item.title}>
              <Statistic title={item.title} value={item.value} />
            </List.Item>
          ))}
          {metaDetails.map((detail) => (
            <List.Item key={detail}>
              <Typography.Text type="secondary">{detail}</Typography.Text>
            </List.Item>
          ))}
        </List>
        {score.missingAnswers.length > 0 ? (
          <Alert
            type="warning"
            showIcon
            message={alertMessage}
            description={missingAnswersDescription}
          />
        ) : (
          <List
            header={<Typography.Text strong>{notesTitle}</Typography.Text>}
            dataSource={notes}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        )}
      </Space>
      <Modal
        open={passwordModalOpen}
        title={modalCopy.title}
        onCancel={handleModalClose}
        onOk={confirmExport}
        okText={modalCopy.confirm}
        confirmLoading={submitting || exporting}
        destroyOnClose
      >
        <Typography.Paragraph>{modalCopy.description(certificateFileName)}</Typography.Paragraph>
        <Input.Password
          placeholder={modalCopy.placeholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />
      </Modal>
    </Card>
  )
}

export default ScoreCard
