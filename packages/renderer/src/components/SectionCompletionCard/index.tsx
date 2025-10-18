import { Card, List, Progress, Typography } from 'antd'

import { useAppSelector } from '@renderer/store/hooks'
import { selectQuestionnaireSchema, selectResponses } from '@renderer/store/slices/questionnaire'

const SectionCompletionCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const responses = useAppSelector(selectResponses)

  if (!schema) {
    return (
      <Card title='Avanzamento sezioni' size='small'>
        <Typography.Text type='secondary'>Schema non disponibile.</Typography.Text>
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
    <Card title='Avanzamento sezioni' size='small'>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[<Typography.Text key='percent'>{item.percent}%</Typography.Text>]}
          >
            <List.Item.Meta
              title={item.title}
              description={<Progress percent={item.percent} size='small' />}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default SectionCompletionCard
