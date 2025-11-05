import { Card, Typography } from 'antd'

import { useSchemaSummaryCard } from '@renderer/components/SchemaSummaryCard.hooks'
import SchemaSummaryCardContent from '@renderer/components/SchemaSummaryCard.Content'

const SchemaSummaryCard = () => {
  const { title, isLoading, hasSchema, stats, labels, emptyText } = useSchemaSummaryCard()

  if (isLoading) {
    return <Card loading title={title} />
  }

  if (!hasSchema || !stats) {
    return (
      <Card>
        <Typography.Text type="secondary">{emptyText}</Typography.Text>
      </Card>
    )
  }

  return <SchemaSummaryCardContent title={title} labels={labels} stats={stats} />
}

export default SchemaSummaryCard
