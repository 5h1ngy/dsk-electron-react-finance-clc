import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import { selectQuestionnaireSchema, selectResponses } from '@renderer/store/slices/questionnaire'

export const useSectionCompletionCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const responses = useAppSelector(selectResponses)
  const { t } = useTranslation()

  const items = useMemo(() => {
    if (!schema) {
      return []
    }
    return schema.sections.map((section) => {
      const total = section.questions.length
      const answered = section.questions.filter(
        (question) =>
          responses[question.id] !== undefined && responses[question.id] !== ''
      ).length
      const percent = total === 0 ? 0 : Math.round((answered / total) * 100)
      return {
        title: section.label,
        percent
      }
    })
  }, [responses, schema])

  return {
    title: t('sectionCompletion.title'),
    emptyText: t('sectionCompletion.empty'),
    hasSchema: Boolean(schema),
    items
  }
}
