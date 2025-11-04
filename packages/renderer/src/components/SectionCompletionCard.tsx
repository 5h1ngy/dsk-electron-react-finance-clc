import { Typography } from 'antd'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'
import SectionCompletionCardContent from '@renderer/components/SectionCompletionCard.Content'

const SectionCompletionCard = () => {
  const { title, emptyText, hasSchema, items } = useSectionCompletionCard()

  if (!hasSchema) {
    return <Typography.Text type="secondary">{emptyText}</Typography.Text>
  }

  return (
    <div aria-label={title} style={{ width: '100%' }}>
      <SectionCompletionCardContent items={items} />
    </div>
  )
}

export default SectionCompletionCard
