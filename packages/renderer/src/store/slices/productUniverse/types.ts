import type { ProductRecord, ProductRecommendation } from '@engines/mapping/rules'

export interface ProductUniverseState {
  products: ProductRecord[]
  categories: Array<{ name: string; count: number }>
  recommendations: ProductRecommendation[]
}
