import { Card, Empty, List, Tag, Typography } from 'antd'

interface SuggestedProductsCardContentProps {
  title: string
  emptyText: string
  recommendations: Array<{
    name: string
    description?: string
    matchReason: string
    category: string
    riskBand: string
  }>
  formatRiskBand: (band: string) => string
}

const SuggestedProductsCardContent = ({
  title,
  emptyText,
  recommendations,
  formatRiskBand
}: SuggestedProductsCardContentProps) => (
  <Card title={title} size="small">
    {recommendations.length === 0 ? (
      <Empty description={emptyText} />
    ) : (
      <List
        size="small"
        dataSource={recommendations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={
                <Typography.Text type="secondary">
                  {item.description || item.matchReason}
                </Typography.Text>
              }
            />
            <Tag color="blue">{item.category}</Tag>
            <Tag color="gold">{formatRiskBand(item.riskBand)}</Tag>
          </List.Item>
        )}
      />
    )}
  </Card>
)

export default SuggestedProductsCardContent
