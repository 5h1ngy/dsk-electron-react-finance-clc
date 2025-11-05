jest.mock('pdfjs-dist/build/pdf.worker?url', () => '', { virtual: true })
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {},
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: async () => ({
        getTextContent: async () => ({
          items: [{ str: 'exp_know_1: 7\nexp_know_2: Si' }]
        })
      }),
      destroy: async () => {}
    })
  })
}))

import { loadQuestionnaireSchema } from '@renderer/config/questionnaire'
import { parseQuestionnairePdf } from '@engines/importers/pdfQuestionnaire'

const createFakeFile = (): File =>
  ({
    name: 'questionario.pdf',
    type: 'application/pdf',
    arrayBuffer: async () => new ArrayBuffer(0)
  }) as File

describe('parseQuestionnairePdf', () => {
  it('estrae i valori riconoscendo id:value nel PDF', async () => {
    const schema = loadQuestionnaireSchema()
    const file = createFakeFile()
    const result = await parseQuestionnairePdf(file, schema)
    expect(result.responses.exp_know_1).toBe(7)
    expect(result.responses.exp_know_2).toBe('Si')
  })
})
