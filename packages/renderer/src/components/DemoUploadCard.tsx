import { useDemoUploadCard } from '@renderer/components/DemoUploadCard.hooks'
import DemoUploadCardContent from '@renderer/components/DemoUploadCard.Content'

const DemoUploadCard = () => {
  const { copy, handleFinanceUpload, handlePdfUpload, status, financeImport, pdfImport } =
    useDemoUploadCard()

  return (
    <DemoUploadCardContent
      copy={copy}
      handleFinanceUpload={handleFinanceUpload}
      handlePdfUpload={handlePdfUpload}
      status={status}
      financeImport={financeImport}
      pdfImport={pdfImport}
    />
  )
}

export default DemoUploadCard
