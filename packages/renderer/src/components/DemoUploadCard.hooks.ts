import { message, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { parseFinanceWorkbook } from '@engines/importers/financeWorkbook'
import { parseQuestionnairePdf } from '@engines/importers/pdfQuestionnaire'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  applyBulkResponses,
  computeQuestionnaireScore,
  selectQuestionnaireSchema
} from '@renderer/store/slices/questionnaire'
import {
  selectFinanceImport,
  selectPdfImport,
  setFinanceImport,
  setPdfImport
} from '@renderer/store/slices/workspace'
import { setProductUniverse } from '@renderer/store/slices/productUniverse'

export const useDemoUploadCard = () => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const financeImport = useAppSelector(selectFinanceImport)
  const pdfImport = useAppSelector(selectPdfImport)
  const { t } = useTranslation()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleFinanceUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const summary = await parseFinanceWorkbook(file)
      dispatch(
        setProductUniverse({
          products: summary.products,
          categories: summary.categories
        })
      )
      dispatch(
        setFinanceImport({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          instruments: summary.instruments,
          categories: summary.categories
        })
      )
      message.success(t('demoUpload.messages.productsSuccess'))
      setStatus({ type: 'success', message: t('demoUpload.status.productsSuccess') })
    } catch (error) {
      const fallback = t('demoUpload.status.productsError')
      const messageText = error instanceof Error ? error.message : fallback
      message.error(messageText)
      setStatus({ type: 'error', message: messageText })
    }
    return Upload.LIST_IGNORE
  }

  const handlePdfUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!schema) {
      message.warning(t('demoUpload.messages.pdfSchemaMissing'))
      setStatus({ type: 'error', message: t('demoUpload.status.schemaMissing') })
      return Upload.LIST_IGNORE
    }
    try {
      const result = await parseQuestionnairePdf(file, schema)
      if (Object.keys(result.responses).length === 0) {
        throw new Error(t('demoUpload.messages.pdfEmpty'))
      }
      dispatch(applyBulkResponses(result.responses))
      dispatch(
        setPdfImport({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          pages: result.pages
        })
      )
      message.success(t('demoUpload.messages.pdfSuccess'))
      setStatus({ type: 'success', message: t('demoUpload.status.pdfSuccess') })
      dispatch(computeQuestionnaireScore())
    } catch (error) {
      const fallback = t('demoUpload.status.pdfError')
      const messageText = error instanceof Error ? error.message : fallback
      message.error(messageText)
      setStatus({ type: 'error', message: messageText })
    }
    return Upload.LIST_IGNORE
  }

  const copy = useMemo(
    () => ({
      title: t('demoUpload.title'),
      description: t('demoUpload.description'),
      drop: {
        products: {
          title: t('demoUpload.drop.products.title'),
          hint: t('demoUpload.drop.products.hint')
        },
        pdf: {
          title: t('demoUpload.drop.pdf.title'),
          hint: t('demoUpload.drop.pdf.hint')
        }
      },
      status: {
        idle: t('demoUpload.status.idle')
      },
      labels: {
        products: t('demoUpload.labels.products'),
        pdf: t('demoUpload.labels.pdf')
      },
      empty: {
        products: t('demoUpload.empty.products'),
        pdf: t('demoUpload.empty.pdf')
      }
    }),
    [t]
  )

  return {
    copy,
    handleFinanceUpload,
    handlePdfUpload,
    status,
    financeImport,
    pdfImport
  }
}
