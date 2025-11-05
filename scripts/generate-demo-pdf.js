const { PDFDocument, StandardFonts } = require('pdf-lib')
const fs = require('fs')
const path = require('path')

const anagrafica = [
  'identity_first_name: Mario',
  'identity_last_name: Rossi',
  'identity_birth_date: 1980-05-12',
  'identity_birth_place: Milano (MI)',
  'identity_fiscal_code: RSSMRA80E12F205X',
  'identity_citizenship: Italia',
  'contact_email: mario.rossi@example.com',
  'contact_phone: +39 333 1234567',
  'residence_address: Via Roma 10',
  'residence_city: Milano',
  'residence_postal_code: 20100',
  'residence_country: Italia',
  'domicile_is_residence: Si',
  'domicile_address: ',
  'work_status: Dipendente',
  'work_employer: Banca Demo',
  'work_seniority: 12',
  'income_bracket: 50000 - 100000 EUR',
  'pep_status: No'
]

const questionnaire = [
  'exp_know_1: 10',
  'exp_know_2: Si',
  'exp_know_3: 25',
  'fin_1: 35',
  'fin_2: 12',
  'horizon_1: 20',
  'goal_1: Crescita del capitale',
  'risk_tol_1: 30',
  'risk_tol_2: Mantengo o aumento',
  'esg_1: Si (moderata)'
]

const margin = 50
const lineSpacing = 6
const fontSize = 12

const ensureSpace = (doc, page, cursor) => {
  if (cursor <= margin) {
    const nextPage = doc.addPage()
    return { page: nextPage, cursor: nextPage.getHeight() - margin }
  }
  return { page, cursor }
}

const writeLines = (doc, page, cursor, font, lines) => {
  let currentPage = page
  let currentCursor = cursor

  lines.forEach((text) => {
    ;({ page: currentPage, cursor: currentCursor } = ensureSpace(
      doc,
      currentPage,
      currentCursor - (fontSize + lineSpacing)
    ))
    currentCursor -= fontSize + lineSpacing
    currentPage.drawText(text, {
      x: margin,
      y: currentCursor,
      size: fontSize,
      font,
      maxWidth: currentPage.getWidth() - margin * 2
    })
  })

  return { page: currentPage, cursor: currentCursor }
}

;(async () => {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage()
  let cursor = page.getHeight() - margin
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const drawTitle = (title) => {
    ;({ page, cursor } = ensureSpace(pdfDoc, page, cursor - (fontSize + lineSpacing)))
    cursor -= fontSize + lineSpacing
    page.drawText(title, {
      x: margin,
      y: cursor,
      size: fontSize,
      font: titleFont
    })
    cursor -= 10
  }

  drawTitle('=== ANAGRAFICA ===')
  ;({ page, cursor } = writeLines(pdfDoc, page, cursor, font, anagrafica))

  page = pdfDoc.addPage()
  cursor = page.getHeight() - margin
  drawTitle('=== QUESTIONARIO PROFILAZIONE ===')
  ;({ page, cursor } = writeLines(pdfDoc, page, cursor, font, questionnaire))

  const pdfBytes = await pdfDoc.save()
  const outputDir = path.resolve('samples')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'demo-import.pdf')
  fs.writeFileSync(outputPath, pdfBytes)
  console.log(`Generated demo PDF at ${outputPath}`)
})()
