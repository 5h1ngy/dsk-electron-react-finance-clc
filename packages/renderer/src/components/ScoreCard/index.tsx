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
      <Card title="Profilo rischio">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text>
              Compila il questionario per generare il profilo di rischio.
            </Typography.Text>
          }
        />
      </Card>
    )
  }

  const exportDisabled = score.missingAnswers.length > 0 || exporting
  const certificateLoaded = Boolean(certificate)

  const exportTooltip = (() => {
    if (score.missingAnswers.length > 0) {
      return 'Completa tutte le risposte obbligatorie prima di esportare il PDF'
    }
    if (!certificateLoaded) {
      return 'Carica e verifica un certificato P12 per abilitare la firma'
    }
    return undefined
  })()

  const handleExportClick = () => {
    if (!certificateLoaded) {
      message.warning('Carica il certificato P12 nella scheda dedicata.')
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
      title="Profilo rischio"
      extra={
        <Space>
          <Typography.Link onClick={handleRecompute}>Ricalcola</Typography.Link>
          <Tooltip title={exportTooltip}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportClick}
              disabled={exportDisabled || !certificateLoaded}
              loading={exporting}
            >
              Esporta PDF firmato
            </Button>
          </Tooltip>
        </Space>
      }
    >
      <Progress type="dashboard" percent={score.score} strokeColor="#0ba5ec" />
      <Divider />
      <List size="small">
        <List.Item>
          <Statistic title="Classe" value={score.riskClass} />
        </List.Item>
        <List.Item>
          <Statistic title="Volatilita" value={score.volatilityBand} />
        </List.Item>
        {meta?.lastCalculatedAt ? (
          <List.Item>
            <Typography.Text type="secondary">
              Aggiornato alle {new Date(meta.lastCalculatedAt).toLocaleTimeString()}
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport ? (
          <List.Item>
            <Typography.Text type="secondary">
              Ultimo export {new Date(lastExport.exportedAt).toLocaleTimeString()} (
              {lastExport.fileName})
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport?.sha256 ? (
          <List.Item>
            <Typography.Text type="secondary">
              SHA-256: {lastExport.sha256}
            </Typography.Text>
          </List.Item>
        ) : null}
        {lastExport?.certificateSubject ? (
          <List.Item>
            <Typography.Text type="secondary">
              Firmato con {lastExport.certificateSubject}
            </Typography.Text>
          </List.Item>
        ) : null}
      </List>
      {score.missingAnswers.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          message="Mancano alcune risposte obbligatorie"
          description={score.missingAnswers.join(', ')}
          style={{ marginTop: 16 }}
        />
      ) : (
        <List
          header={<Typography.Text strong>Note principali</Typography.Text>}
          dataSource={score.rationales}
          style={{ marginTop: 16 }}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      )}
      <Modal
        open={passwordModalOpen}
        title="Firma e hash del report"
        onCancel={() => {
          setPasswordModalOpen(false)
          setPassword('')
        }}
        onOk={confirmExport}
        okText="Firma ed esporta"
        confirmLoading={submitting || exporting}
        destroyOnClose
      >
        <Typography.Paragraph>
          Inserisci la password per firmare il PDF con il certificato{' '}
          <Typography.Text strong>{certificate?.fileName}</Typography.Text>.
        </Typography.Paragraph>
        <Input.Password
          placeholder="Password certificato"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />
      </Modal>
    </Card>
  )
}

export default ScoreCard
