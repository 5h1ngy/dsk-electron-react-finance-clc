import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import { selectRecommendations } from '@renderer/store/slices/productUniverse'

export const useSuggestedProductsCard = () => {
  const recommendations = useAppSelector(selectRecommendations)
  const { t } = useTranslation()

  const formatRiskBand = useCallback(
    (band: string) => {
      const key = `risk.band.${band}`
      const value = t(key)
      return value === key ? band : value
    },
    [t]
  )

  return {
    title: t('suggestedProducts.title'),
    emptyText: t('suggestedProducts.empty'),
    recommendations,
    formatRiskBand
  }
}
