import { useProductUniverseCard } from '@renderer/components/ProductUniverseCard.hooks'
import ProductUniverseCardContent from '@renderer/components/ProductUniverseCard.Content'

const ProductUniverseCard = () => {
  const { title, statLabel, emptyText, categories, productCount } = useProductUniverseCard()

  return (
    <ProductUniverseCardContent
      title={title}
      statLabel={statLabel}
      emptyText={emptyText}
      categories={categories}
      productCount={productCount}
    />
  )
}

export default ProductUniverseCard
