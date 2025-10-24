import { Card, Empty, List, Tag, Typography } from 'antd'

import { useSuggestedProductsCard } from '@renderer/components/SuggestedProductsCard/hooks/useSuggestedProductsCard'

const SuggestedProductsCard = () => {
  const { title, emptyText, recommendations, formatRiskBand } = useSuggestedProductsCard()

  return (
    <Card title={title} size="small" style={{ height: '100%' }}>
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
}

export default SuggestedProductsCard
