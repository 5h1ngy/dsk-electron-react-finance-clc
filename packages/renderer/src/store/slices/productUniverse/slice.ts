import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { mapProductsToProfile } from '@renderer/domain/mapping'
import type { ProductRecord, ProductRecommendation } from '@renderer/domain/mapping/rules'
import type { RiskScoreResult } from '@renderer/domain/scoring'
import type { ProductUniverseState } from '@renderer/store/slices/productUniverse/types'

const initialState: ProductUniverseState = {
  products: [],
  categories: [],
  recommendations: []
}

const productUniverseSlice = createSlice({
  name: 'productUniverse',
  initialState,
  reducers: {
    setProductUniverse: (
      state,
      action: PayloadAction<{ products: ProductRecord[]; categories: Array<{ name: string; count: number }> }>
    ) => {
      state.products = action.payload.products
      state.categories = action.payload.categories
    },
    setRecommendations: (state, action: PayloadAction<ProductRecommendation[]>) => {
      state.recommendations = action.payload
    }
  }
})

export const { setProductUniverse, setRecommendations } = productUniverseSlice.actions
export const productUniverseReducer = productUniverseSlice.reducer

export const buildRecommendations = (
  score: RiskScoreResult,
  products: ProductRecord[]
): ProductRecommendation[] => mapProductsToProfile(score, products)
