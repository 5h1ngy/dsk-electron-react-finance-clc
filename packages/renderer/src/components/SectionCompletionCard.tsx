import { Card, List, Progress, Typography, Tooltip } from 'antd'

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
    <Card title={title} size="small">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <Tooltip title={`${item.percent}%`}>
                  <Progress percent={item.percent} size="small" showInfo />
                </Tooltip>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default SectionCompletionCard
