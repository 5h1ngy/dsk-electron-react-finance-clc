import { Card, Progress, Space, Typography } from 'antd'

interface SectionCompletionCardContentProps {
  title: string
  items: Array<{ title: string; percent: number }>
}

const SectionCompletionCardContent = ({ title, items }: SectionCompletionCardContentProps) => (
  <Card title={title} size="small">
    <Space
      align="center"
      size="large"
      style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}
    >
      {items.map((item) => (
        <Space key={item.title} direction="vertical" size={6} align="center">
          <Typography.Text strong>{item.title}</Typography.Text>
          <Progress type="dashboard" percent={item.percent} size={80} strokeColor="#0ba5ec" />
        </Space>
      ))}
    </Space>
  </Card>
)

export default SectionCompletionCardContent
