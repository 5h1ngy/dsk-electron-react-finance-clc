import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '@renderer/store/types'

const selectProductUniverse = (state: RootState) => state.productUniverse

export const selectProducts = createSelector(selectProductUniverse, (state) => state.products)
export const selectProductCategories = createSelector(
  selectProductUniverse,
  (state) => state.categories
)
export const selectRecommendations = createSelector(
  selectProductUniverse,
  (state) => state.recommendations
)
