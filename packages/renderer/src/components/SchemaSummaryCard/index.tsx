import { Card, List, Statistic, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireStatus
} from '@renderer/store/slices/questionnaire'

const SchemaSummaryCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const status = useAppSelector(selectQuestionnaireStatus)
  const { t } = useTranslation()

  if (status === 'loading') {
    return <Card loading title={t('schemaSummary.title')} />
  }

  if (!schema) {
    return (
      <Card>
        <Typography.Text type="secondary">{t('schemaSummary.empty')}</Typography.Text>
      </Card>
    )
  }

  const sections = schema.sections.length
  const questions = schema.sections.reduce((acc, section) => acc + section.questions.length, 0)

  return (
    <Card title={t('schemaSummary.title')} size="small" bordered>
      <List size="small">
        <List.Item>
          <Statistic title={t('schemaSummary.version')} value={schema.schemaVersion} />
        </List.Item>
        <List.Item>
          <Statistic title={t('schemaSummary.sections')} value={sections} />
        </List.Item>
        <List.Item>
          <Statistic title={t('schemaSummary.questions')} value={questions} />
        </List.Item>
      </List>
    </Card>
  )
}

export default SchemaSummaryCard
