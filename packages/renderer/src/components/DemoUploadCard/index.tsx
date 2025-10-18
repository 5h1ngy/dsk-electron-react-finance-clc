import { InboxOutlined } from '@ant-design/icons'
import { Card, List, message, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'

import { parseFinanceWorkbook } from '@renderer/domain/importers/financeWorkbook'
import { parseQuestionnaireWorkbook } from '@renderer/domain/importers/requestWorkbook'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  applyBulkResponses,
  selectQuestionnaireSchema
} from '@renderer/store/slices/questionnaire'
import {
  selectFinanceImport,
  selectRequestImport,
  setFinanceImport,
  setRequestImport
} from '@renderer/store/slices/workspace'

const { Dragger } = Upload

const DemoUploadCard = () => {
  const dispatch = useAppDispatch()
  const schema = useAppSelector(selectQuestionnaireSchema)
  const requestImport = useAppSelector(selectRequestImport)
  const financeImport = useAppSelector(selectFinanceImport)

  const handleQuestionnaireUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const responses = await parseQuestionnaireWorkbook(file)
      if (!schema) {
        throw new Error('Schema non disponibile')
      }
      dispatch(applyBulkResponses(responses))
      dispatch(
        setRequestImport({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          responses: Object.keys(responses).length
        })
      )
      message.success('Questionario importato correttamente')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Impossibile importare il questionario'
      )
    }
    return Upload.LIST_IGNORE
  }

  const handleFinanceUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const summary = await parseFinanceWorkbook(file)
      dispatch(
        setFinanceImport({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          instruments: summary.instruments,
          categories: summary.categories
        })
      )
      message.success('Universo prodotti importato')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Impossibile importare il file strumenti'
      )
    }
    return Upload.LIST_IGNORE
  }

  return (
    <Card title="Import manuale (demo)">
      <Typography.Paragraph type="secondary">
        Trascina qui i file forniti (.demo) per precompilare il questionario oppure per caricare
        l&apos;universo prodotti.
      </Typography.Paragraph>
      <Dragger multiple={false} beforeUpload={handleQuestionnaireUpload} accept=".xlsx,.xls" showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Questionario cliente (.xlsx)</p>
        <p className="ant-upload-hint">Il foglio deve usare gli stessi ID delle domande</p>
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
        <p className="ant-upload-text">Universo prodotti (.xlsx)</p>
        <p className="ant-upload-hint">Conteggiamo strumenti e categorie per la proposta</p>
      </Dragger>
      <List
        size="small"
        header={<Typography.Text strong>Ultimi import</Typography.Text>}
        dataSource={[
          requestImport
            ? `Questionario: ${requestImport.fileName} (${requestImport.responses} risposte)`
            : 'Nessun questionario importato',
          financeImport
            ? `Prodotti: ${financeImport.fileName} (${financeImport.instruments} strumenti)`
            : 'Nessun universo prodotti importato'
        ]}
        style={{ marginTop: 16 }}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  )
}

export default DemoUploadCard
