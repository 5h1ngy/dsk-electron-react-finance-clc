import { Card, List, Statistic } from 'antd'

interface SchemaSummaryCardContentProps {
  title: string
  labels: { version: string; sections: string; questions: string }
  stats: { version: string; sections: number; questions: number }
}

const SchemaSummaryCardContent = ({ title, labels, stats }: SchemaSummaryCardContentProps) => (
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

export default SchemaSummaryCardContent
