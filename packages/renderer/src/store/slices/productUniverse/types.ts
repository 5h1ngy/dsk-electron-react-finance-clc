import type { ProductRecord, ProductRecommendation } from '@renderer/domain/mapping/rules'

export interface ProductUniverseState {
  products: ProductRecord[]
  categories: Array<{ name: string; count: number }>
  recommendations: ProductRecommendation[]
}
