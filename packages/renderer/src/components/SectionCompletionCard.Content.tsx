import { Card, List, Progress, Tooltip } from 'antd'

interface SectionCompletionCardContentProps {
  title: string
  items: Array<{ title: string; percent: number }>
}

const SectionCompletionCardContent = ({ title, items }: SectionCompletionCardContentProps) => (
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

export default SectionCompletionCardContent
