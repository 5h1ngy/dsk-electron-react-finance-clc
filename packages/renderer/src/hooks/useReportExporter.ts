import { message } from 'antd'
import { useCallback, useState } from 'react'

import { SCORING_ENGINE_VERSION } from '@renderer/config/versions'
import {
  extractCertificateSummary,
  type CertificateSummary
} from '@renderer/domain/signature'
import { generateRiskReport } from '@renderer/domain/report'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  selectQuestionnaireSchema,
  selectQuestionnaireScore,
  selectResponses
} from '@renderer/store/slices/questionnaire'
import {
  selectCertificate,
  setReportExport
} from '@renderer/store/slices/workspace'

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
  const certificate = useAppSelector(selectCertificate)
  const [exporting, setExporting] = useState(false)

  const buildMetadata = (summary: CertificateSummary) => ({
    schemaVersion: schema?.schemaVersion ?? 'unknown',
    scoringVersion: SCORING_ENGINE_VERSION,
    questionnaireTitle: schema?.title ?? 'unknown',
    generatedAt: new Date().toISOString(),
    riskClass: score?.riskClass ?? 'N/A',
    riskScore: score?.score ?? 0,
    volatility: score?.volatilityBand ?? 'N/A',
    certificateSubject: summary.subject,
    certificateIssuer: summary.issuer,
    certificateSerial: summary.serialNumber
  })

  const exportReport = useCallback(
    async (password: string): Promise<boolean> => {
      if (!schema || !score) {
        message.warning('Completa il questionario prima di esportare il report.')
        return false
      }
      if (!certificate) {
        message.warning('Carica e verifica un certificato P12 per firmare il PDF.')
        return false
      }
      if (!password) {
        message.warning('Inserisci la password del certificato.')
        return false
      }
      setExporting(true)
      try {
        const bytes = await generateRiskReport({ schema, responses, score })
        const base64 = toBase64(bytes)
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
          metadata: buildMetadata(certificateSummary),
          includeManifest: true,
          includeHashFile: true
        })
        if (!response.ok) {
          message.error(response.message ?? 'Impossibile esportare il report')
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
        message.success('Report firmato ed esportato correttamente.')
        return true
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : 'Errore inatteso durante la generazione del report'
        )
        return false
      } finally {
        setExporting(false)
      }
    },
    [certificate, dispatch, responses, schema, score]
  )

  return { exportReport, exporting }
}
