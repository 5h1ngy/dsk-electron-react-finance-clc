import { Card, Empty, List, Tag, Typography } from ''antd''

import { useAppSelector } from ''@renderer/store/hooks''
import { selectRecommendations } from ''@renderer/store/slices/productUniverse''

const SuggestedProductsCard = () => {
  const recommendations = useAppSelector(selectRecommendations)

  return (
    <Card title="Proposta strumenti" size="small" style={{ height: '100%' }}>
      {recommendations.length === 0 ? (
        <Empty description="Carica universo prodotti e calcola il profilo" />
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
              <Tag color="gold">{item.riskBand}</Tag>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default SuggestedProductsCard
