import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import {
  selectProductCategories,
  selectProducts
} from '@renderer/store/slices/productUniverse'

export const useProductUniverseCard = () => {
  const categories = useAppSelector(selectProductCategories)
  const products = useAppSelector(selectProducts)
  const { t } = useTranslation()

  return {
    title: t('productUniverse.title'),
    statLabel: t('productUniverse.stat'),
    emptyText: t('productUniverse.empty'),
    categories,
    productCount: products.length
  }
}
