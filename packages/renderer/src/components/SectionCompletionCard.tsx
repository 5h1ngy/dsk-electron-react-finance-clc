import { Card, Typography } from 'antd'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'
import SectionCompletionCardContent from '@renderer/components/SectionCompletionCard.Content'

const SectionCompletionCard = () => {
  const { title, emptyText, hasSchema, items } = useSectionCompletionCard()

  if (!hasSchema) {
    return (
      <Card title={title} size="small">
        <Typography.Text type="secondary">{emptyText}</Typography.Text>
      </Card>
    )
  }

  return <SectionCompletionCardContent title={title} items={items} />
}

export default SectionCompletionCard
