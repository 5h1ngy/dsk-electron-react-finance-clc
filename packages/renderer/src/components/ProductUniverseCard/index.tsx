import { Card, List, Statistic, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import { selectProductCategories, selectProducts } from '@renderer/store/slices/productUniverse'

const ProductUniverseCard = () => {
  const categories = useAppSelector(selectProductCategories)
  const products = useAppSelector(selectProducts)
  const { t } = useTranslation()

  return (
    <Card title={t('productUniverse.title')} size="small" style={{ height: '100%' }}>
      <Statistic
        value={products.length}
        title={t('productUniverse.stat')}
        style={{ marginBottom: 16 }}
      />
      {products.length === 0 ? (
        <Typography.Text type="secondary">{t('productUniverse.empty')}</Typography.Text>
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
    </Card>
  )
}

export default ProductUniverseCard
