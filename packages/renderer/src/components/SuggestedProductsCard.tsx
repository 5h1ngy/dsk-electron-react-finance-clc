import { useSuggestedProductsCard } from '@renderer/components/SuggestedProductsCard.hooks'
import SuggestedProductsCardContent from '@renderer/components/SuggestedProductsCard.Content'

const SuggestedProductsCard = () => {
  const { title, emptyText, recommendations, formatRiskBand } = useSuggestedProductsCard()

  return (
    <SuggestedProductsCardContent
      title={title}
      emptyText={emptyText}
      recommendations={recommendations}
      formatRiskBand={formatRiskBand}
    />
  )
}

export default SuggestedProductsCard
