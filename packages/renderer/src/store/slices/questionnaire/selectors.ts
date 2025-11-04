import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '@renderer/store/types'

export const selectQuestionnaireState = (state: RootState) => state.questionnaire

export const selectQuestionnaireSchema = createSelector(
  selectQuestionnaireState,
  (state) => state.schema
)

export const selectQuestionnaireStatus = createSelector(
  selectQuestionnaireState,
  (state) => state.schemaStatus
)

export const selectResponses = createSelector(selectQuestionnaireState, (state) => state.responses)

export const selectQuestionnaireScore = createSelector(
  selectQuestionnaireState,
  (state) => state.score
)

export const selectScoreMeta = createSelector(selectQuestionnaireState, (state) => ({
  lastCalculatedAt: state.lastCalculatedAt
}))

export const selectAnsweredProgress = createSelector(selectQuestionnaireState, (state) => {
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
