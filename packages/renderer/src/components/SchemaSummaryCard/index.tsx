import { Card, List, Statistic, Typography } from 'antd'

import { useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireStatus
} from '@renderer/store/slices/questionnaire'

const SchemaSummaryCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const status = useAppSelector(selectQuestionnaireStatus)

  if (status === 'loading') {
    return <Card loading title="Questionario" />
  }

  if (!schema) {
    return (
      <Card>
        <Typography.Text type="secondary">Schema questionario non disponibile</Typography.Text>
      </Card>
    )
  }

  const sections = schema.sections.length
  const questions = schema.sections.reduce((acc, section) => acc + section.questions.length, 0)

  return (
    <Card title="Questionario configurato" size="small" bordered>
      <List size="small">
        <List.Item>
          <Statistic title="Versione" value={schema.schemaVersion} />
        </List.Item>
        <List.Item>
          <Statistic title="Sezioni" value={sections} />
        </List.Item>
        <List.Item>
          <Statistic title="Domande" value={questions} />
        </List.Item>
      </List>
    </Card>
  )
}

export default SchemaSummaryCard
