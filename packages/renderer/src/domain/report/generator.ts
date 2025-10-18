import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import type {
  QuestionnaireResponses,
  QuestionnaireSchema
} from '@renderer/domain/questionnaire'
import type { RiskScoreResult } from '@renderer/domain/scoring'

export interface ReportPayload {
  schema: QuestionnaireSchema
  responses: QuestionnaireResponses
  score: RiskScoreResult
}

const formatDateTime = (date = new Date()): string =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

const formatResponse = (value: unknown): string => {
  if (value === undefined || value === null || value === '') {
    return '—'
  }
  return String(value)
}

export const generateRiskReport = async ({ schema, responses, score }: ReportPayload): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage()
  const { width, height } = page.getSize()
  const margin = 40
  const contentWidth = width - margin * 2
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica)

  let cursor = height - margin

  const drawText = (text: string, options: { size: number; font?: typeof bodyFont; color?: { r: number; g: number; b: number } }) => {
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

  drawText('Offline Risk Suite', { size: 18, font: titleFont })
  drawText(`Report di profilazione – ${schema.title}`, { size: 12 })
  drawText(`Generato il ${formatDateTime()}`, { size: 10, color: rgb(0.3, 0.3, 0.3) })
  cursor -= 10
  drawText(`Punteggio: ${score.score} · Classe: ${score.riskClass} · Volatilità: ${score.volatilityBand}`, {
    size: 12,
    font: titleFont
  })

  score.rationales.forEach((rationale) => drawText(`- ${rationale}`, { size: 10 }))

  schema.sections.forEach((section) => {
    cursor -= 20
    drawText(section.label, { size: 12, font: titleFont })
    section.questions.forEach((question) => {
      drawText(`${question.label}: ${formatResponse(responses[question.id])}`, { size: 10 })
    })
  })

  const bytes = await pdf.save()
  return bytes
}
