import { FilePdfOutlined, InfoCircleOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  Progress,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  theme
} from 'antd'

import type { RiskScoreResult } from '@engines/scoring'

interface ScoreCardModalCopy {
  title: string
  description: (fileName: string | undefined) => string
  placeholder: string
  confirm: string
}

interface UnsignedModalCopy {
  title: string
  description: string
  confirm: string
  cancel: string
}

interface ScoreCardContentProps {
  title: string
  statHighlights: Array<{ title: string; value: string }>
  metaDetails: string[]
  notes: string[]
  alertMessage: string
  missingAnswersDescription: string
  exportTooltip: string | undefined
  exportLabel: string
  recomputeLabel: string
  notesTitle: string
  mergeNotice: string
  modalCopy: ScoreCardModalCopy
  unsignedModalCopy: UnsignedModalCopy
  passwordModalOpen: boolean
  unsignedModalOpen: boolean
  password: string
  setPassword: (value: string) => void
  handleRecompute: () => void
  handleExportClick: () => void
  handleModalClose: () => void
  handleUnsignedClose: () => void
  confirmExport: () => Promise<void>
  confirmUnsignedExport: () => Promise<void>
  exporting: boolean
  submitting: boolean
  certificateFileName: string
  score: RiskScoreResult
}

const ScoreCardContent = ({
  title,
  statHighlights,
  metaDetails,
  notes,
  alertMessage,
  missingAnswersDescription,
  exportTooltip,
  exportLabel,
  recomputeLabel,
  notesTitle,
  mergeNotice,
  modalCopy,
  unsignedModalCopy,
  passwordModalOpen,
  unsignedModalOpen,
  password,
  setPassword,
  handleRecompute,
  handleExportClick,
  handleModalClose,
  handleUnsignedClose,
  confirmExport,
  confirmUnsignedExport,
  exporting,
  submitting,
  certificateFileName,
  score
}: ScoreCardContentProps) => {
  const { token } = theme.useToken()
  const exportDisabled = score.missingAnswers.length > 0 || exporting

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Tooltip title={recomputeLabel}>
            <Button type="text" onClick={handleRecompute} icon={<InfoCircleOutlined />} />
          </Tooltip>
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
      <Space direction="vertical" size={token.marginLG} style={{ width: '100%' }}>
        <Space
          align="center"
          size="large"
          style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
          <Progress
            type="dashboard"
            percent={score.score}
            strokeColor={{ from: token.colorPrimary, to: token.colorSuccess }}
            size={140}
            format={(value) => (
              <Typography.Title level={3} style={{ margin: 0 }}>
                {value}
              </Typography.Title>
            )}
          />
          <Space direction="vertical" size={token.marginSM}>
            {statHighlights.map((stat) => (
              <Statistic key={stat.title} title={stat.title} value={stat.value} />
            ))}
          </Space>
          <Space direction="vertical" size={4}>
            {metaDetails.map((detail) => (
              <Tag key={detail} color="default">
                {detail}
              </Tag>
            ))}
          </Space>
        </Space>

        {score.missingAnswers.length > 0 ? (
          <Alert type="warning" showIcon message={alertMessage} description={missingAnswersDescription} />
        ) : (
          <Card
            size="small"
            type="inner"
            title={notesTitle}
            styles={{
              body: { display: 'flex', flexDirection: 'column', gap: token.marginXS }
            }}
          >
            {notes.map((item) => (
              <Typography.Text key={item} type="secondary">
                • {item}
              </Typography.Text>
            ))}
          </Card>
        )}

        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {mergeNotice}
        </Typography.Paragraph>
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
        <Typography.Paragraph>
          <Typography.Text style={{ display: 'block', marginBottom: token.marginXS }}>
            {modalCopy.placeholder}
          </Typography.Text>
          <Input.Password
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={modalCopy.placeholder}
          />
        </Typography.Paragraph>
      </Modal>

      <Modal
        open={unsignedModalOpen}
        title={unsignedModalCopy.title}
        onCancel={handleUnsignedClose}
        onOk={confirmUnsignedExport}
        okText={unsignedModalCopy.confirm}
        cancelText={unsignedModalCopy.cancel}
        confirmLoading={submitting || exporting}
      >
        <Typography.Paragraph>{unsignedModalCopy.description}</Typography.Paragraph>
      </Modal>
    </Card>
  )
}

export default ScoreCardContent
