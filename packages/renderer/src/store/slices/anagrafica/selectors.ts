import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '@renderer/store/types'

export const selectAnagraficaState = (state: RootState) => state.anagrafica

export const selectAnagraficaSchema = createSelector(
  selectAnagraficaState,
  (state) => state.schema
)

export const selectAnagraficaStatus = createSelector(
  selectAnagraficaState,
  (state) => state.schemaStatus
)

export const selectAnagraficaResponses = createSelector(
  selectAnagraficaState,
  (state) => state.responses
)

export const selectAnagraficaProgress = createSelector(selectAnagraficaState, (state) => {
  if (!state.schema) {
    return { completed: 0, required: 0 }
  }

  const totalRequired = state.schema.sections.reduce(
    (acc, section) => acc + section.questions.filter((question) => question.required).length,
    0
  )

  const answeredRequired = state.schema.sections.reduce((acc, section) => {
    return (
      acc +
      section.questions.filter(
        (question) => question.required && state.responses[question.id] !== undefined
      ).length
    )
  }, 0)

  const completed = totalRequired === 0 ? 0 : Math.round((answeredRequired / totalRequired) * 100)

  return { completed, required: totalRequired }
})
