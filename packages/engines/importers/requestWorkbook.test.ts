import { parseQuestionnaireWorkbook } from './requestWorkbook'
import { read, utils } from 'xlsx'

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}))

const createMockFile = (): File =>
  ({
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    name: 'questionnaire.xlsx'
  }) as unknown as File

describe('parseQuestionnaireWorkbook', () => {
  beforeEach(() => {
    jest.mocked(read).mockReset()
    jest.mocked(utils.sheet_to_json).mockReset()
  })

  it('maps the first data row into questionnaire responses', async () => {
    const mockSheet = {}
    jest.mocked(read).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: mockSheet }
    } as unknown as ReturnType<typeof read>)
    jest.mocked(utils.sheet_to_json).mockReturnValue([
      ['q1', 'q2', 'ignored'],
      [42, 'Alta', null]
    ])

    const responses = await parseQuestionnaireWorkbook(createMockFile())
    expect(responses).toEqual({ q1: 42, q2: 'Alta' })
  })

  it('raises a descriptive error when no sheets are present', async () => {
    jest.mocked(read).mockReturnValue({
      SheetNames: [],
      Sheets: {}
    } as unknown as ReturnType<typeof read>)

    await expect(parseQuestionnaireWorkbook(createMockFile())).rejects.toThrow(
      'Workbook senza fogli'
    )
  })
})
