import { Typography } from 'antd'

import { useSectionCompletionCard } from '@renderer/components/SectionCompletionCard.hooks'
import SectionCompletionCardContent from '@renderer/components/SectionCompletionCard.Content'

const SectionCompletionCard = () => {
  const { emptyText, hasSchema, items } = useSectionCompletionCard()

  if (!hasSchema) {
    return <Typography.Text type="secondary">{emptyText}</Typography.Text>
  }

  return <SectionCompletionCardContent items={items} />
}

export default SectionCompletionCard
