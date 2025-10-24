import { Card, List, Progress, Typography } from 'antd'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'

const SectionCompletionCard = () => {
  const { title, emptyText, hasSchema, items } = useSectionCompletionCard()

  if (!hasSchema) {
    return (
      <Card title={title} size="small">
        <Typography.Text type="secondary">{emptyText}</Typography.Text>
      </Card>
    )
  }

  return (
    <Card title={title} size="small" style={{ height: '100%' }}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <Progress
                  percent={item.percent}
                  size="small"
                  showInfo
                  tooltip={{ formatter: () => `${item.percent}%` }}
                />
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default SectionCompletionCard
