import { useDiagnosticsPage } from '@renderer/pages/Diagnostics/hooks'
import DiagnosticsPageContent from '@renderer/pages/Diagnostics/DiagnosticsPage.Content'

const DiagnosticsPage = () => {
  const { importsTitle, importEntries, healthCard } = useDiagnosticsPage()

  return (
    <DiagnosticsPageContent
      importsTitle={importsTitle}
      importEntries={importEntries}
      healthCard={{
        title: healthCard.title,
        refreshLabel: healthCard.refreshLabel,
        loading: healthCard.loading,
        error: healthCard.error,
        snapshot: healthCard.snapshot,
        waiting: healthCard.waiting,
        labels: healthCard.labels,
        onRefresh: healthCard.refresh
      }}
    />
  )
}

export default DiagnosticsPage
