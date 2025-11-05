import { PDFDocument, StandardFonts, rgb, type RGB } from 'pdf-lib'

import { SCORING_ENGINE_VERSION } from '@renderer/config/versions'
import i18n from '@renderer/i18n'
import type { QuestionnaireResponses, QuestionnaireSchema } from '@engines/questionnaire'
import type { RiskScoreResult } from '@engines/scoring'

export interface ReportPayload {
  questionnaire: {
    schema: QuestionnaireSchema
    responses: QuestionnaireResponses
    score: RiskScoreResult
  }
  anagrafica?: {
    schema: QuestionnaireSchema
    responses: QuestionnaireResponses
  }
}

const formatDateTime = (date = new Date()): string =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

const formatResponse = (value: unknown): string => {
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  return String(value)
}

export const generateRiskReport = async ({
  questionnaire,
  anagrafica
}: ReportPayload): Promise<Uint8Array> => {
  const { schema: questionnaireSchema, responses: questionnaireResponses, score } = questionnaire
  const pdf = await PDFDocument.create()
  let page = pdf.addPage()
  const margin = 40
  const getContentWidth = () => page.getWidth() - margin * 2
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica)

  let cursor = page.getHeight() - margin
  const lineSpacing = 6

  const startNewPage = () => {
    page = pdf.addPage()
    cursor = page.getHeight() - margin
  }

  const ensureSpace = (size: number) => {
    if (cursor - (size + lineSpacing) <= margin) {
      startNewPage()
    }
  }

  const drawText = (
    text: string,
    options: { size?: number; font?: typeof bodyFont; color?: RGB } = {}
  ) => {
    const { size = 12, font = bodyFont, color = rgb(0, 0, 0) } = options
    ensureSpace(size)
    cursor -= size + lineSpacing
    page.drawText(text, {
      x: margin,
      y: cursor,
      size,
      font,
      color,
      maxWidth: getContentWidth()
    })
  }

  const addSpacing = (value: number) => {
    ensureSpace(value)
    cursor -= value
  }

  const localizedRiskClass = i18n.t(`risk.class.${score.riskClass}`)
  const localizedVolatility = i18n.t(`risk.band.${score.volatilityBand}`)

  drawText(i18n.t('app.title'), { size: 18, font: titleFont })
  drawText(i18n.t('report.pdf.title', { title: questionnaireSchema.title }), { size: 12 })
  drawText(i18n.t('report.pdf.generated', { date: formatDateTime() }), {
    size: 10,
    color: rgb(0.3, 0.3, 0.3)
  })
  drawText(
    i18n.t('report.pdf.versions', {
      schema: questionnaireSchema.schemaVersion,
      scoring: SCORING_ENGINE_VERSION
    }),
    { size: 10, color: rgb(0.3, 0.3, 0.3) }
  )
  cursor -= 10
  drawText(
    i18n.t('report.pdf.summary', {
      score: score.score,
      riskClass: localizedRiskClass,
      volatility: localizedVolatility
    }),
    {
      size: 12,
      font: titleFont
    }
  )

  score.rationales.forEach((rationale) => drawText(`- ${i18n.t(rationale)}`, { size: 10 }))

  const appendSections = (
    schema: QuestionnaireSchema,
    responses: QuestionnaireResponses,
    heading: string
  ) => {
    drawText(heading, { size: 12, font: titleFont })
    schema.sections.forEach((section) => {
      addSpacing(14)
      drawText(section.label, { size: 11, font: titleFont })
      section.questions.forEach((question) => {
        drawText(`${question.label}: ${formatResponse(responses[question.id])}`, { size: 10 })
      })
    })
  }

  if (anagrafica) {
    addSpacing(16)
    appendSections(anagrafica.schema, anagrafica.responses, anagrafica.schema.title)
    startNewPage()
  }

  addSpacing(16)
  appendSections(
    questionnaireSchema,
    questionnaireResponses,
    i18n.t('report.sections.questionnaire')
  )

  cursor -= 30
  drawText(i18n.t('report.pdf.hashNotice'), {
    size: 9,
    color: rgb(0.4, 0.4, 0.4)
  })
  drawText(i18n.t('report.pdf.manifestNotice'), { size: 9, color: rgb(0.4, 0.4, 0.4) })

  const bytes = await pdf.save()
  return bytes
}
