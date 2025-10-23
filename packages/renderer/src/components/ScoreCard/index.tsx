import { useEffect, useState } from 'react'
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
  message
} from 'antd'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  computeQuestionnaireScore,
  selectQuestionnaireScore,
  selectScoreMeta
} from '@renderer/store/slices/questionnaire'
import { selectCertificate, selectReportExport } from '@renderer/store/slices/workspace'
import { useReportExporter } from '@renderer/hooks/useReportExporter'
import { selectProducts, setRecommendations } from '@renderer/store/slices/productUniverse'
import { buildRecommendations } from '@renderer/store/slices/productUniverse/slice'

const ScoreCard = () => {
  const dispatch = useAppDispatch()
  const score = useAppSelector(selectQuestionnaireScore)
  const meta = useAppSelector(selectScoreMeta)
  const lastExport = useAppSelector(selectReportExport)
  const certificate = useAppSelector(selectCertificate)
  const products = useAppSelector(selectProducts)
  const { exportReport, exporting } = useReportExporter()
  const { t } = useTranslation()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRecompute = () => {
    dispatch(computeQuestionnaireScore())
  }

  useEffect(() => {
    if (score && products.length) {
      dispatch(setRecommendations(buildRecommendations(score, products)))
    }
  }, [dispatch, products, score])

  if (!score) {
    return (
      <Card title={t('score.title')}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text>{t('score.empty')}</Typography.Text>
          }
        />
      </Card>
    )
  }

  const exportDisabled = score.missingAnswers.length > 0 || exporting
  const certificateLoaded = Boolean(certificate)

  const exportTooltip = (() => {
    if (score.missingAnswers.length > 0) {
      return t('score.exportTooltipIncomplete')
    }
    if (!certificateLoaded) {
      return t('score.exportTooltipCertificate')
    }
    return undefined
  })()

  const handleExportClick = () => {
    if (!certificateLoaded) {
      message.warning(t('score.messages.certificateMissing'))
      return
    }
    setPasswordModalOpen(true)
  }

  const confirmExport = async () => {
    setSubmitting(true)
    const ok = await exportReport(password)
    setSubmitting(false)
    if (ok) {
      setPassword('')
      setPasswordModalOpen(false)
    }
  }

  return (
    <Card
      title={t('score.title')}
      extra={
        <Space>
          <Typography.Link onClick={handleRecompute}>{t('score.recompute')}</Typography.Link>
          <Tooltip title={exportTooltip}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportClick}
              disabled={exportDisabled || !certificateLoaded}
              loading={exporting}
            >
              {t('score.export')}
            </Button>
          </Tooltip>
        </Space>
      }
    >
      <Progress type="dashboard" percent={score.score} strokeColor="#0ba5ec" />
      <Divider />
      <List size="small">
        <List.Item>
          <Statistic title={t('score.stats.class')} value={t(`risk.class.${score.riskClass}`)} />
        </List.Item>
        <List.Item>
          <Statistic
            title={t('score.stats.volatility')}
            value={t(`risk.band.${score.volatilityBand}`)}
          />
        </List.Item>
        {meta?.lastCalculatedAt ? (
          <List.Item>
            <Typography.Text type="secondary">
              {t('score.stats.updated', {
                time: new Date(meta.lastCalculatedAt).toLocaleTimeString()
              })}
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport ? (
          <List.Item>
            <Typography.Text type="secondary">
              {t('score.stats.lastExport', {
                time: new Date(lastExport.exportedAt).toLocaleTimeString(),
                file: lastExport.fileName
              })}
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport?.sha256 ? (
          <List.Item>
            <Typography.Text type="secondary">
              {t('score.stats.hash', { hash: lastExport.sha256 })}
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport?.certificateSubject ? (
          <List.Item>
            <Typography.Text type="secondary">
              {t('score.stats.certificate', { subject: lastExport.certificateSubject })}
            </Typography.Text>
          </List.Item>
        ) : null}
      </List>
      {score.missingAnswers.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          message={t('score.messages.missingAnswers')}
          description={score.missingAnswers.join(', ')}
          style={{ marginTop: 16 }}
        />
      ) : (
        <List
          header={<Typography.Text strong>{t('score.notesTitle')}</Typography.Text>}
          dataSource={score.rationales}
          style={{ marginTop: 16 }}
          renderItem={(item) => <List.Item>{t(item)}</List.Item>}
        />
      )}
      <Modal
        open={passwordModalOpen}
        title={t('score.modal.title')}
        onCancel={() => {
          setPasswordModalOpen(false)
          setPassword('')
        }}
        onOk={confirmExport}
        okText={t('score.modal.confirm')}
        confirmLoading={submitting || exporting}
        destroyOnClose
      >
        <Typography.Paragraph>
          {t('score.modal.description', { file: certificate?.fileName ?? 'P12' })}
        </Typography.Paragraph>
        <Input.Password
          placeholder={t('score.modal.placeholder')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />
      </Modal>
    </Card>
  )
}

export default ScoreCard
