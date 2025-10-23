import { Card, Empty, List, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import { selectRecommendations } from '@renderer/store/slices/productUniverse'

const SuggestedProductsCard = () => {
  const recommendations = useAppSelector(selectRecommendations)
  const { t } = useTranslation()

  return (
    <Card title={t('suggestedProducts.title')} size="small" style={{ height: '100%' }}>
      {recommendations.length === 0 ? (
        <Empty description={t('suggestedProducts.empty')} />
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
              <Tag color="gold">{t(`risk.band.${item.riskBand}`)}</Tag>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default SuggestedProductsCard
