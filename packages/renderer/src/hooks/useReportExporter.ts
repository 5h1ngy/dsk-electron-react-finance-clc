import { message } from 'antd'
import { useCallback } from 'react'

import { generateRiskReport } from '@renderer/domain/report'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireScore,
  selectResponses
} from '@renderer/store/slices/questionnaire'
import { setReportExport } from '@renderer/store/slices/workspace'

const toBase64 = (bytes: Uint8Array): string => {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export const useReportExporter = () => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const responses = useAppSelector(selectResponses)
  const score = useAppSelector(selectQuestionnaireScore)

  const exportReport = useCallback(async () => {
    if (!schema || !score) {
      message.warning('Completa il questionario prima di esportare il report.')
      return
    }
    try {
      const bytes = await generateRiskReport({ schema, responses, score })
      const base64 = toBase64(bytes)
      const suggestedName = `risk-report-${new Date().toISOString().split('T')[0]}.pdf`
      const response = await window.api.report.exportPdf({ base64, suggestedName })
      if (!response.ok) {
        message.error(response.message ?? 'Impossibile esportare il report')
        return
      }
      if (response.cancelled) {
        return
      }
      dispatch(
        setReportExport({
          fileName: suggestedName,
          exportedAt: new Date().toISOString()
        })
      )
      message.success('Report esportato correttamente')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Errore inatteso durante la generazione del report'
      )
    }
  }, [dispatch, schema, responses, score])

  return { exportReport }
}
