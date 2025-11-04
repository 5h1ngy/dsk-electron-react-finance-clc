import { Space, Typography } from 'antd'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'
import SectionCompletionCardContent from '@renderer/components/SectionCompletionCard.Content'

const SectionCompletionCard = () => {
  const { title, emptyText, hasSchema, items } = useSectionCompletionCard()

  if (!hasSchema) {
    return <Typography.Text type="secondary">{emptyText}</Typography.Text>
  }

  return (
    <Space direction="vertical" size={4} style={{ width: '100%' }}>
      <Typography.Text strong>{title}</Typography.Text>
      <SectionCompletionCardContent items={items} />
    </Space>
  )
}

export default SectionCompletionCard
