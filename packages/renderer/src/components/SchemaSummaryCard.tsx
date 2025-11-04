import { Card, List, Statistic, Typography } from 'antd'

import { useSchemaSummaryCard } from '@renderer/components/SchemaSummaryCard.hooks'

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

  return (
    <Card title={title} size="small" bordered>
      <List size="small">
        <List.Item>
          <Statistic title={labels.version} value={stats.version} />
        </List.Item>
        <List.Item>
          <Statistic title={labels.sections} value={stats.sections} />
        </List.Item>
        <List.Item>
          <Statistic title={labels.questions} value={stats.questions} />
        </List.Item>
      </List>
    </Card>
  )
}

export default SchemaSummaryCard
