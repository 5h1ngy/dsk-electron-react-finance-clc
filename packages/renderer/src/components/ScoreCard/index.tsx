import { useEffect } from 'react'
import { FilePdfOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Divider, Empty, List, Progress, Space, Statistic, Tooltip, Typography } from 'antd'

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  computeQuestionnaireScore,
  selectQuestionnaireScore,
  selectScoreMeta
} from '@renderer/store/slices/questionnaire'
import { selectReportExport } from '@renderer/store/slices/workspace'
import { useReportExporter } from '@renderer/hooks/useReportExporter'
import { selectProducts, setRecommendations } from '@renderer/store/slices/productUniverse'
import { buildRecommendations } from '@renderer/store/slices/productUniverse/slice'

const ScoreCard = () => {
  const dispatch = useAppDispatch()
  const score = useAppSelector(selectQuestionnaireScore)
  const meta = useAppSelector(selectScoreMeta)
  const lastExport = useAppSelector(selectReportExport)
  const products = useAppSelector(selectProducts)
  const { exportReport } = useReportExporter()

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

  const exportDisabled = score.missingAnswers.length > 0

  return (
    <Card
      title="Profilo rischio"
      extra={
        <Space>
          <Typography.Link onClick={handleRecompute}>Ricalcola</Typography.Link>
          <Tooltip
            title={
              exportDisabled
                ? 'Completa tutte le risposte obbligatorie prima di esportare il PDF'
                : undefined
            }
          >
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={exportReport}
              disabled={exportDisabled}
            >
              Esporta PDF
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
              Ultimo export {new Date(lastExport.exportedAt).toLocaleTimeString()} ({lastExport.fileName})
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
    </Card>
  )
}

export default ScoreCard
