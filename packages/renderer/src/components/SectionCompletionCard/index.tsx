import { Card, List, Progress, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import { selectQuestionnaireSchema, selectResponses } from '@renderer/store/slices/questionnaire'

const SectionCompletionCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const responses = useAppSelector(selectResponses)
  const { t } = useTranslation()

  if (!schema) {
    return (
      <Card title={t('sectionCompletion.title')} size="small">
        <Typography.Text type="secondary">{t('sectionCompletion.empty')}</Typography.Text>
      </Card>
    )
  }

  const items = schema.sections.map((section) => {
    const total = section.questions.length
    const answered = section.questions.filter((question) => responses[question.id] !== undefined && responses[question.id] !== '').length
    const percent = total === 0 ? 0 : Math.round((answered / total) * 100)
    return {
      title: section.label,
      percent
    }
  })

  return (
    <Card title={t('sectionCompletion.title')} size="small" style={{ height: '100%' }}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <Progress percent={item.percent} size="small" showInfo tooltip={{ formatter: () => `${item.percent}%` }} />
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default SectionCompletionCard
