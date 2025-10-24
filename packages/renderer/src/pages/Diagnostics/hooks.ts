import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useHealthStatus } from '@renderer/hooks/useHealthStatus'
import { useAppSelector } from '@renderer/store/hooks'
import {
  selectCertificate,
  selectFinanceImport,
  selectPdfImport,
  selectReportExport,
  selectRequestImport
} from '@renderer/store/slices/workspace'

export const useDiagnosticsPage = () => {
  const health = useHealthStatus()
  const requestImport = useAppSelector(selectRequestImport)
  const financeImport = useAppSelector(selectFinanceImport)
  const pdfImport = useAppSelector(selectPdfImport)
  const reportExport = useAppSelector(selectReportExport)
  const certificate = useAppSelector(selectCertificate)
  const { t } = useTranslation()

  const importEntries = useMemo(
    () => [
      {
        label: t('diagnostics.imports.labels.questionnaire'),
        value: requestImport
          ? t('diagnostics.imports.values.questionnaire', {
              file: requestImport.fileName,
              count: requestImport.responses
            })
          : t('diagnostics.imports.empty.questionnaire')
      },
      {
        label: t('diagnostics.imports.labels.products'),
        value: financeImport
          ? t('diagnostics.imports.values.products', {
              file: financeImport.fileName,
              count: financeImport.instruments
            })
          : t('diagnostics.imports.empty.products')
      },
      {
        label: t('diagnostics.imports.labels.pdf'),
        value: pdfImport
          ? t('diagnostics.imports.values.pdf', {
              file: pdfImport.fileName,
              pages: pdfImport.pages
            })
          : t('diagnostics.imports.empty.pdf')
      },
      {
        label: t('diagnostics.imports.labels.report'),
        value: reportExport
          ? t('diagnostics.imports.values.report', {
              file: reportExport.fileName,
              date: new Date(reportExport.exportedAt).toLocaleString()
            })
          : t('diagnostics.imports.empty.report')
      },
      {
        label: t('diagnostics.imports.labels.hash'),
        value: reportExport?.sha256 ?? t('diagnostics.imports.empty.hash')
      },
      {
        label: t('diagnostics.imports.labels.hashFile'),
        value: reportExport?.hashPath ?? t('diagnostics.imports.empty.hashFile')
      },
      {
        label: t('diagnostics.imports.labels.manifest'),
        value: reportExport?.manifestPath ?? t('diagnostics.imports.empty.manifest')
      },
      {
        label: t('diagnostics.imports.labels.certificate'),
        value: certificate
          ? certificate.summary
            ? t('diagnostics.imports.certificate.verified', {
                file: certificate.fileName,
                subject: certificate.summary.subject
              })
            : t('diagnostics.imports.certificate.pending', { file: certificate.fileName })
          : t('diagnostics.imports.empty.certificate')
      }
    ],
    [certificate, financeImport, pdfImport, reportExport, requestImport, t]
  )

  return {
    importsTitle: t('diagnostics.imports.title'),
    importEntries,
    healthCard: {
      title: t('health.card.title'),
      refreshLabel: t('health.card.refresh'),
      waiting: t('health.card.waiting'),
      labels: {
        version: t('diagnostics.health.version'),
        status: t('diagnostics.health.status'),
        uptime: t('diagnostics.health.uptime')
      },
      ...health
    }
  }
}
