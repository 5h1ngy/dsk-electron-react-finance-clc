import { Card, List, Space, Statistic, Typography } from 'antd'

import { useProductUniverseCard } from '@renderer/components/ProductUniverseCard.hooks'

const ProductUniverseCard = () => {
  const { title, statLabel, emptyText, categories, productCount } = useProductUniverseCard()

  return (
    <Card title={title} size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Statistic value={productCount} title={statLabel} />
        {productCount === 0 ? (
          <Typography.Text type="secondary">{emptyText}</Typography.Text>
        ) : (
          <List
            size="small"
            dataSource={categories}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item.name}</Typography.Text>
                <Typography.Text strong>{item.count}</Typography.Text>
              </List.Item>
            )}
          />
        )}
      </Space>
    </Card>
  )
}

export default ProductUniverseCard
