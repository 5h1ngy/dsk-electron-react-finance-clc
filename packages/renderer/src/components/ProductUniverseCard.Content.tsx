import { Card, List, Space, Statistic, Typography } from 'antd'

interface ProductUniverseCardContentProps {
  title: string
  statLabel: string
  emptyText: string
  categories: Array<{ name: string; count: number }>
  productCount: number
}

const ProductUniverseCardContent = ({
  title,
  statLabel,
  emptyText,
  categories,
  productCount
}: ProductUniverseCardContentProps) => (
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

export default ProductUniverseCardContent
