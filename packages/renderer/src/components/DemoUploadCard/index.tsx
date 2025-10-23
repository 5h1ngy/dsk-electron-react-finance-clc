import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons'
import { Card, List, message, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useTranslation } from 'react-i18next'

import { parseFinanceWorkbook } from '@renderer/domain/importers/financeWorkbook'
import { parseQuestionnaireWorkbook } from '@renderer/domain/importers/requestWorkbook'
import { parseQuestionnairePdf } from '@renderer/domain/importers/pdfQuestionnaire'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  applyBulkResponses,
  selectQuestionnaireSchema
} from '@renderer/store/slices/questionnaire'
import {
  selectFinanceImport,
  selectPdfImport,
  selectRequestImport,
  setFinanceImport,
  setPdfImport,
  setRequestImport
} from '@renderer/store/slices/workspace'
import { setProductUniverse } from '@renderer/store/slices/productUniverse'

const { Dragger } = Upload

const DemoUploadCard = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const requestImport = useAppSelector(selectRequestImport)
  const financeImport = useAppSelector(selectFinanceImport)
  const pdfImport = useAppSelector(selectPdfImport)

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
      message.error(
        error instanceof Error ? error.message : t('demoUpload.messages.productsError')
      )
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
      message.error(
        error instanceof Error ? error.message : t('demoUpload.messages.pdfError')
      )
    }
    return Upload.LIST_IGNORE
  }

  return (
    <Card title={t('demoUpload.title')} style={{ height: '100%' }}>
      <Typography.Paragraph type="secondary">
        {t('demoUpload.description')}
      </Typography.Paragraph>
      <Dragger multiple={false} beforeUpload={handleQuestionnaireUpload} accept=".xlsx,.xls" showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('demoUpload.drop.questionnaire.title')}</p>
        <p className="ant-upload-hint">{t('demoUpload.drop.questionnaire.hint')}</p>
      </Dragger>
      <Dragger
        multiple={false}
        beforeUpload={handleFinanceUpload}
        accept=".xlsx,.xls"
        showUploadList={false}
        style={{ marginTop: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('demoUpload.drop.products.title')}</p>
        <p className="ant-upload-hint">{t('demoUpload.drop.products.hint')}</p>
      </Dragger>
      <Dragger
        multiple={false}
        beforeUpload={handlePdfUpload}
        accept=".pdf"
        showUploadList={false}
        style={{ marginTop: 16, borderStyle: 'dashed' }}
      >
        <p className="ant-upload-drag-icon">
          <FilePdfOutlined />
        </p>
        <p className="ant-upload-text">{t('demoUpload.drop.pdf.title')}</p>
        <p className="ant-upload-hint">{t('demoUpload.drop.pdf.hint')}</p>
      </Dragger>
      <List
        size="small"
        header={<Typography.Text strong>{t('demoUpload.list.title')}</Typography.Text>}
        dataSource={[
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
        ]}
        style={{ marginTop: 16 }}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  )
}

export default DemoUploadCard
