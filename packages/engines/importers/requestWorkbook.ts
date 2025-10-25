import { read, utils } from 'xlsx'

import i18n from '@renderer/i18n'
import type { QuestionnaireResponseValue, QuestionnaireResponses } from '@engines/questionnaire'

const toRecord = (header: unknown[], row: unknown[]): QuestionnaireResponses => {
  const record: QuestionnaireResponses = {}
  header.forEach((column, index) => {
    const questionId = String(column ?? '').trim()
    if (!questionId) {
      return
    }
    const rawValue = row[index]
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return
    }
    record[questionId] = rawValue as QuestionnaireResponseValue
  })
  return record
}

export const parseQuestionnaireWorkbook = async (file: File): Promise<QuestionnaireResponses> => {
  const buffer = await file.arrayBuffer()
  const workbook = read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) {
    throw new Error(i18n.t('errors.workbook.noSheets'))
  }
  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false })
  const [header, ...data] = rows
  if (!header || !header.length) {
    throw new Error(i18n.t('errors.workbook.noHeaders'))
  }
  const firstRow = data[0] ?? []
  return toRecord(header, firstRow)
}
