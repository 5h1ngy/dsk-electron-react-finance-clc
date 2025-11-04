import { useScoreCard } from '@renderer/components/ScoreCard.hooks'
import ScoreCardContent from '@renderer/components/ScoreCard.Content'
import ScoreCardEmpty from '@renderer/components/ScoreCard.Empty'

const ScoreCard = () => {
  const data = useScoreCard()

  if (!data.score) {
    return <ScoreCardEmpty title={data.title} description={data.emptyDescription} />
  }

  return (
    <ScoreCardContent
      title={data.title}
      statHighlights={data.statHighlights}
      metaDetails={data.metaDetails}
      notes={data.notes}
      alertMessage={data.alertMessage}
      missingAnswersDescription={data.missingAnswersDescription}
      exportTooltip={data.exportTooltip}
      exportLabel={data.exportLabel}
      recomputeLabel={data.recomputeLabel}
      notesTitle={data.notesTitle}
      modalCopy={data.modalCopy}
      unsignedModalCopy={data.unsignedModalCopy}
      passwordModalOpen={data.passwordModalOpen}
      unsignedModalOpen={data.unsignedModalOpen}
      password={data.password}
      setPassword={data.setPassword}
      handleRecompute={data.handleRecompute}
      handleExportClick={data.handleExportClick}
      handleModalClose={data.handleModalClose}
      confirmExport={data.confirmExport}
      handleUnsignedClose={data.handleUnsignedClose}
      confirmUnsignedExport={data.confirmUnsignedExport}
      exporting={data.exporting}
      submitting={data.submitting}
      certificateFileName={data.certificateFileName}
      score={data.score}
    />
  )
}

export default ScoreCard
