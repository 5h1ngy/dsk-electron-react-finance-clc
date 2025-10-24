import { message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useReportExporter } from '@renderer/hooks/useReportExporter'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  computeQuestionnaireScore,
  selectQuestionnaireScore,
  selectScoreMeta
} from '@renderer/store/slices/questionnaire'
import { selectCertificate, selectReportExport } from '@renderer/store/slices/workspace'
import { selectProducts, setRecommendations } from '@renderer/store/slices/productUniverse'
import { buildRecommendations } from '@renderer/store/slices/productUniverse/slice'

export const useScoreCard = () => {
  const dispatch = useAppDispatch()
  const score = useAppSelector(selectQuestionnaireScore)
  const meta = useAppSelector(selectScoreMeta)
  const lastExport = useAppSelector(selectReportExport)
  const certificate = useAppSelector(selectCertificate)
  const products = useAppSelector(selectProducts)
  const { exportReport, exporting } = useReportExporter()
  const { t } = useTranslation()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (score && products.length) {
      dispatch(setRecommendations(buildRecommendations(score, products)))
    }
  }, [dispatch, products, score])

  const handleRecompute = useCallback(() => {
    dispatch(computeQuestionnaireScore())
  }, [dispatch])

  const certificateLoaded = Boolean(certificate)
  const exportTooltip = useMemo(() => {
    if (!score) {
      return undefined
    }
    if (score.missingAnswers.length > 0) {
      return t('score.exportTooltipIncomplete')
    }
    if (!certificateLoaded) {
      return t('score.exportTooltipCertificate')
    }
    return undefined
  }, [certificateLoaded, score, t])

  const handleExportClick = useCallback(() => {
    if (!certificateLoaded) {
      message.warning(t('score.messages.certificateMissing'))
      return
    }
    setPasswordModalOpen(true)
  }, [certificateLoaded, t])

  const handleModalClose = useCallback(() => {
    setPasswordModalOpen(false)
    setPassword('')
  }, [])

  const confirmExport = useCallback(async () => {
    setSubmitting(true)
    const ok = await exportReport(password)
    setSubmitting(false)
    if (ok) {
      setPassword('')
      setPasswordModalOpen(false)
    }
  }, [exportReport, password])

  const statHighlights = useMemo(() => {
    if (!score) {
      return []
    }
    return [
      {
        title: t('score.stats.class'),
        value: t(`risk.class.${score.riskClass}`)
      },
      {
        title: t('score.stats.volatility'),
        value: t(`risk.band.${score.volatilityBand}`)
      }
    ]
  }, [score, t])

  const metaDetails = useMemo(() => {
    if (!score) {
      return []
    }
    const details: string[] = []
    if (meta?.lastCalculatedAt) {
      details.push(
        t('score.stats.updated', {
          time: new Date(meta.lastCalculatedAt).toLocaleTimeString()
        })
      )
    }
    if (lastExport) {
      details.push(
        t('score.stats.lastExport', {
          time: new Date(lastExport.exportedAt).toLocaleTimeString(),
          file: lastExport.fileName
        })
      )
    }
    if (lastExport?.sha256) {
      details.push(t('score.stats.hash', { hash: lastExport.sha256 }))
    }
    if (lastExport?.certificateSubject) {
      details.push(t('score.stats.certificate', { subject: lastExport.certificateSubject }))
    }
    return details
  }, [lastExport, meta?.lastCalculatedAt, score, t])

  const notes = useMemo(() => {
    if (!score) {
      return []
    }
    return score.rationales.map((key) => t(key))
  }, [score, t])

  const missingAnswersDescription = useMemo(
    () => (score ? score.missingAnswers.join(', ') : ''),
    [score]
  )

  return {
    title: t('score.title'),
    emptyDescription: t('score.empty'),
    score,
    statHighlights,
    metaDetails,
    notes,
    alertMessage: t('score.messages.missingAnswers'),
    missingAnswersDescription,
    exportTooltip,
    exportLabel: t('score.export'),
    recomputeLabel: t('score.recompute'),
    notesTitle: t('score.notesTitle'),
    modalCopy: {
      title: t('score.modal.title'),
      description: (fileName: string | undefined) =>
        t('score.modal.description', { file: fileName ?? 'P12' }),
      placeholder: t('score.modal.placeholder'),
      confirm: t('score.modal.confirm')
    },
    passwordModalOpen,
    password,
    setPassword,
    handleRecompute,
    handleExportClick,
    handleModalClose,
    confirmExport,
    exporting,
    submitting,
    certificateFileName: certificate?.fileName ?? 'P12'
  }
}
