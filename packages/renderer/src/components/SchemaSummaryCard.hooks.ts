import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireStatus
} from '@renderer/store/slices/questionnaire'

export const useSchemaSummaryCard = () => {
  const schema = useAppSelector(selectQuestionnaireSchema)
  const status = useAppSelector(selectQuestionnaireStatus)
  const { t } = useTranslation()

  const stats = useMemo(() => {
    if (!schema) {
      return null
    }
    const sections = schema.sections.length
    const questions = schema.sections.reduce((acc, section) => acc + section.questions.length, 0)
    return {
      version: schema.schemaVersion,
      sections,
      questions
    }
  }, [schema])

  return {
    title: t('schemaSummary.title'),
    isLoading: status === 'loading',
    hasSchema: Boolean(schema),
    stats,
    labels: {
      version: t('schemaSummary.version'),
      sections: t('schemaSummary.sections'),
      questions: t('schemaSummary.questions')
    },
    emptyText: t('schemaSummary.empty')
  }
}
