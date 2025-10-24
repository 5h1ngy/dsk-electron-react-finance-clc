import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import { SCORING_ENGINE_VERSION } from '@renderer/config/versions'
import i18n from '@renderer/i18n'
import type {
  QuestionnaireResponses,
  QuestionnaireSchema
} from '@engines/questionnaire'
import type { RiskScoreResult } from '@engines/scoring'

export interface ReportPayload {
  schema: QuestionnaireSchema
  responses: QuestionnaireResponses
  score: RiskScoreResult
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
  schema,
  responses,
  score
}: ReportPayload): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage()
  const { width, height } = page.getSize()
  const margin = 40
  const contentWidth = width - margin * 2
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica)

  let cursor = height - margin

  const drawText = (
    text: string,
    options: { size: number; font?: typeof bodyFont; color?: { r: number; g: number; b: number } }
  ) => {
    const { size, font = bodyFont, color = rgb(0, 0, 0) } = options
    cursor -= size + 6
    page.drawText(text, {
      x: margin,
      y: cursor,
      size,
      font,
      color,
      maxWidth: contentWidth
    })
  }

  const localizedRiskClass = i18n.t(`risk.class.${score.riskClass}`)
  const localizedVolatility = i18n.t(`risk.band.${score.volatilityBand}`)

  drawText(i18n.t('app.title'), { size: 18, font: titleFont })
  drawText(i18n.t('report.pdf.title', { title: schema.title }), { size: 12 })
  drawText(i18n.t('report.pdf.generated', { date: formatDateTime() }), {
    size: 10,
    color: rgb(0.3, 0.3, 0.3)
  })
  drawText(
    i18n.t('report.pdf.versions', {
      schema: schema.schemaVersion,
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

  score.rationales.forEach((rationale) =>
    drawText(`- ${i18n.t(rationale)}`, { size: 10 })
  )

  schema.sections.forEach((section) => {
    cursor -= 20
    drawText(section.label, { size: 12, font: titleFont })
    section.questions.forEach((question) => {
      drawText(`${question.label}: ${formatResponse(responses[question.id])}`, { size: 10 })
    })
  })

  cursor -= 30
  drawText(
    i18n.t('report.pdf.hashNotice'),
    {
      size: 9,
      color: rgb(0.4, 0.4, 0.4)
    }
  )
  drawText(
    i18n.t('report.pdf.manifestNotice'),
    { size: 9, color: rgb(0.4, 0.4, 0.4) }
  )

  const bytes = await pdf.save()
  return bytes
}

