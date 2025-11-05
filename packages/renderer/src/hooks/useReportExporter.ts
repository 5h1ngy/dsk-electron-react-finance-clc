import { message } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SCORING_ENGINE_VERSION } from '@renderer/config/versions'
import { extractCertificateSummary } from '@engines/signature'
import { generateRiskReport } from '@engines/report'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireScore,
  selectResponses
} from '@renderer/store/slices/questionnaire'
import {
  selectAnagraficaResponses,
  selectAnagraficaSchema
} from '@renderer/store/slices/anagrafica'
import { selectCertificate, setReportExport } from '@renderer/store/slices/workspace'

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
  const anagraficaSchema = useAppSelector(selectAnagraficaSchema)
  const anagraficaResponses = useAppSelector(selectAnagraficaResponses)
  const score = useAppSelector(selectQuestionnaireScore)
  const certificate = useAppSelector(selectCertificate)
  const [exporting, setExporting] = useState(false)
  const { t } = useTranslation()

  const buildMetadata = useCallback(
    () => ({
      schemaVersion: schema?.schemaVersion ?? 'unknown',
      scoringVersion: SCORING_ENGINE_VERSION,
      questionnaireTitle: schema?.title ?? 'unknown',
      generatedAt: new Date().toISOString(),
      riskClass: score?.riskClass ?? 'N/A',
      riskScore: score?.score ?? 0,
      volatility: score?.volatilityBand ?? 'N/A'
    }),
    [schema?.schemaVersion, schema?.title, score?.riskClass, score?.score, score?.volatilityBand]
  )

  const exportReport = useCallback(
    async (password: string): Promise<boolean> => {
      if (!schema || !score) {
        message.warning(t('report.messages.missingData'))
        return false
      }
      if (!certificate) {
        message.warning(t('report.messages.certificateMissing'))
        return false
      }
      if (!password) {
        message.warning(t('report.messages.passwordMissing'))
        return false
      }
      setExporting(true)
      try {
        const bytes = await generateRiskReport({
          questionnaire: { schema, responses, score },
          anagrafica: anagraficaSchema
            ? { schema: anagraficaSchema, responses: anagraficaResponses }
            : undefined
        })
        const base64 = toBase64(bytes)
        const metadata = buildMetadata()
        const certificateSummary = extractCertificateSummary(certificate.base64, password)
        const suggestedName = `risk-report-${new Date().toISOString().split('T')[0]}.pdf`
        const response = await window.api.report.exportPdf({
          pdfBase64: base64,
          suggestedName,
          certificate: {
            base64: certificate.base64,
            password,
            fileName: certificate.fileName
          },
          metadata,
          includeManifest: true,
          includeHashFile: true
        })
        if (!response.ok) {
          message.error(response.message ?? t('report.messages.exportError'))
          return false
        }
        if (response.cancelled) {
          return false
        }
        dispatch(
          setReportExport({
            fileName: suggestedName,
            exportedAt: response.savedAt ?? new Date().toISOString(),
            sha256: response.sha256,
            manifestPath: response.manifestPath,
            certificateSubject: certificateSummary.subject,
            hashPath: response.hashPath
          })
        )
        message.success(t('report.messages.success'))
        return true
      } catch (error) {
        message.error(error instanceof Error ? error.message : t('report.messages.unexpected'))
        return false
      } finally {
        setExporting(false)
      }
    },
    [
      anagraficaResponses,
      anagraficaSchema,
      buildMetadata,
      certificate,
      dispatch,
      responses,
      schema,
      score,
      t
    ]
  )

  const exportUnsignedReport = useCallback(async (): Promise<boolean> => {
    if (!schema || !score) {
      message.warning(t('report.messages.missingData'))
      return false
    }
    setExporting(true)
    try {
      const bytes = await generateRiskReport({
        questionnaire: { schema, responses, score },
        anagrafica: anagraficaSchema
          ? { schema: anagraficaSchema, responses: anagraficaResponses }
          : undefined
      })
      const base64 = toBase64(bytes)
      const suggestedName = `risk-report-${new Date().toISOString().split('T')[0]}-unsigned.pdf`
      const response = await window.api.report.exportPdf({
        pdfBase64: base64,
        suggestedName,
        metadata: buildMetadata(),
        skipSignature: true
      })
      if (!response.ok) {
        message.error(response.message ?? t('report.messages.exportError'))
        return false
      }
      if (response.cancelled) {
        return false
      }
      dispatch(
        setReportExport({
          fileName: suggestedName,
          exportedAt: response.savedAt ?? new Date().toISOString()
        })
      )
      message.success(t('report.messages.success'))
      return true
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('report.messages.unexpected'))
      return false
    } finally {
      setExporting(false)
    }
  }, [
    anagraficaResponses,
    anagraficaSchema,
    buildMetadata,
    dispatch,
    responses,
    schema,
    score,
    t
  ])

  return { exportReport, exportUnsignedReport, exporting }
}
