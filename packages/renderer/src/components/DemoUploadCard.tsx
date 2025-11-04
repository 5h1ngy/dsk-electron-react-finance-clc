import { useDemoUploadCard } from '@renderer/components/DemoUploadCard.hooks'
import DemoUploadCardContent from '@renderer/components/DemoUploadCard.Content'

const DemoUploadCard = () => {
  const { copy, listItems, handleQuestionnaireUpload, handleFinanceUpload, handlePdfUpload } =
    useDemoUploadCard()

  return (
    <DemoUploadCardContent
      copy={copy}
      listItems={listItems}
      handleQuestionnaireUpload={handleQuestionnaireUpload}
      handleFinanceUpload={handleFinanceUpload}
      handlePdfUpload={handlePdfUpload}
    />
  )
}

export default DemoUploadCard
