import { message, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { parseFinanceWorkbook } from '@engines/importers/financeWorkbook'
import { parseQuestionnairePdf } from '@engines/importers/pdfQuestionnaire'
import { parseQuestionnaireWorkbook } from '@engines/importers/requestWorkbook'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { applyBulkResponses, selectQuestionnaireSchema } from '@renderer/store/slices/questionnaire'
import {
  selectFinanceImport,
  selectPdfImport,
  selectRequestImport,
  setFinanceImport,
  setPdfImport,
  setRequestImport
} from '@renderer/store/slices/workspace'
import { setProductUniverse } from '@renderer/store/slices/productUniverse'

export const useDemoUploadCard = () => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const requestImport = useAppSelector(selectRequestImport)
  const financeImport = useAppSelector(selectFinanceImport)
  const pdfImport = useAppSelector(selectPdfImport)
  const { t } = useTranslation()

  const handleQuestionnaireUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const responses = await parseQuestionnaireWorkbook(file)
      if (!schema) {
        throw new Error(t('demoUpload.messages.schemaMissing'))
      }
      dispatch(applyBulkResponses(responses))
      dispatch(
        setRequestImport({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          responses: Object.keys(responses).length
        })
      )
      message.success(t('demoUpload.messages.questionnaireSuccess'))
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('demoUpload.messages.questionnaireError')
      )
    }
    return Upload.LIST_IGNORE
  }

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
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('demoUpload.messages.productsError'))
    }
    return Upload.LIST_IGNORE
  }

  const handlePdfUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!schema) {
      message.warning(t('demoUpload.messages.pdfSchemaMissing'))
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
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('demoUpload.messages.pdfError'))
    }
    return Upload.LIST_IGNORE
  }

  const listItems = useMemo(
    () => [
      requestImport
        ? t('demoUpload.list.questionnaire', {
            file: requestImport.fileName,
            count: requestImport.responses
          })
        : t('demoUpload.list.questionnaireEmpty'),
      pdfImport
        ? t('demoUpload.list.pdf', { file: pdfImport.fileName })
        : t('demoUpload.list.pdfEmpty'),
      financeImport
        ? t('demoUpload.list.products', {
            file: financeImport.fileName,
            count: financeImport.instruments
          })
        : t('demoUpload.list.productsEmpty')
    ],
    [financeImport, pdfImport, requestImport, t]
  )

  const copy = useMemo(
    () => ({
      title: t('demoUpload.title'),
      description: t('demoUpload.description'),
      drop: {
        questionnaire: {
          title: t('demoUpload.drop.questionnaire.title'),
          hint: t('demoUpload.drop.questionnaire.hint')
        },
        products: {
          title: t('demoUpload.drop.products.title'),
          hint: t('demoUpload.drop.products.hint')
        },
        pdf: {
          title: t('demoUpload.drop.pdf.title'),
          hint: t('demoUpload.drop.pdf.hint')
        }
      },
      listTitle: t('demoUpload.list.title')
    }),
    [t]
  )

  return {
    copy,
    listItems,
    handleQuestionnaireUpload,
    handleFinanceUpload,
    handlePdfUpload
  }
}
