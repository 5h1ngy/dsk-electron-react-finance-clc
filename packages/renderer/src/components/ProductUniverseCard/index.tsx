import { Card, List, Statistic, Typography } from 'antd'

import { useAppSelector } from '@renderer/store/hooks'
import { selectProductCategories, selectProducts } from '@renderer/store/slices/productUniverse'

const ProductUniverseCard = () => {
  const categories = useAppSelector(selectProductCategories)
  const products = useAppSelector(selectProducts)

  return (
    <Card title='Universo prodotti' size='small' style={{ height: '100%' }}>
      <Statistic value={products.length} title='Strumenti importati' style={{ marginBottom: 16 }} />
      {products.length === 0 ? (
        <Typography.Text type='secondary'>
          Carica il file .xlsx per visualizzare categorie e conteggi.
        </Typography.Text>
      ) : (
        <List
          size='small'
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
