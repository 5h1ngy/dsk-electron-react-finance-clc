import { Card, Empty, Typography } from 'antd'

interface ScoreCardEmptyProps {
  title: string
  description: string
}

const ScoreCardEmpty = ({ title, description }: ScoreCardEmptyProps) => (
  <Card title={title}>
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<Typography.Text>{description}</Typography.Text>}
    />
  </Card>
)

export default ScoreCardEmpty
