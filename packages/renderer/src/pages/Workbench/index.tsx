import { useWorkbenchPage } from '@renderer/pages/Workbench/hooks'
import WorkbenchPageContent from '@renderer/pages/Workbench/WorkbenchPage.Content'

const WorkbenchPage = () => {
  useWorkbenchPage()

  return <WorkbenchPageContent />
}

export default WorkbenchPage
