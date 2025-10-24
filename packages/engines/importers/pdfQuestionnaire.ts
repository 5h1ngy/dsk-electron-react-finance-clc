import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker?url'

import type {
  QuestionnaireResponses,
  QuestionnaireSchema,
  QuestionDefinition
} from '@engines/questionnaire'

GlobalWorkerOptions.workerSrc = workerSrc

const coerceValue = (raw: string, question: QuestionDefinition): string | number => {
  const trimmed = raw.trim()
  if (question.type === 'single_choice') {
    return trimmed
  }
  const numeric = Number(trimmed.replace(',', '.'))
  if (!Number.isNaN(numeric)) {
    return numeric
  }
  return trimmed
}

const findValueInText = (text: string, questionId: string): string | undefined => {
  const pattern = new RegExp(`${questionId}\\s*[:=]\\s*([^\\n]+)`, 'i')
  const match = text.match(pattern)
  return match?.[1]?.trim()
}

export interface PdfImportResult {
  responses: QuestionnaireResponses
  pages: number
}

export const parseQuestionnairePdf = async (
  file: File,
  schema: QuestionnaireSchema
): Promise<PdfImportResult> => {
  const data = await file.arrayBuffer()
  const pdf = await getDocument({ data }).promise
  let text = ''

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('\n')
    text += `\n${pageText}`
  }

  await pdf.destroy()

  const responses: QuestionnaireResponses = {}
  const pages = pdf.numPages

  schema.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const rawValue = findValueInText(text, question.id)
      if (!rawValue) {
        return
      }
      responses[question.id] = coerceValue(rawValue, question)
    })
  })

  return { responses, pages }
}

