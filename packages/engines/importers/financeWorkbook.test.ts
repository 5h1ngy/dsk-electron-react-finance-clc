import { parseFinanceWorkbook } from './financeWorkbook'
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
    name: 'finance.xlsx'
  }) as unknown as File

describe('parseFinanceWorkbook', () => {
  beforeEach(() => {
    jest.mocked(read).mockReset()
    jest.mocked(utils.sheet_to_json).mockReset()
  })

  it('aggregates categories, instruments and products based on heuristics', async () => {
    const mockSheet = {}
    jest.mocked(read).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: mockSheet }
    } as unknown as ReturnType<typeof read>)

    jest.mocked(utils.sheet_to_json).mockReturnValue([
      {
        Categoria: 'Azioni Europa',
        Nome: 'Alpha Equity',
        Rischio: 'Medio',
        Descrizione: 'Linea bilanciata'
      },
      {
        Categoria: 'Azioni Europa',
        Nome: '',
        Rischio: 'Medio-Bassa',
        Descrizione: ''
      },
      {
        Categoria: 'Multi-Asset',
        Nome: 'Flexible Fund',
        Rischio: 'Alta'
      }
    ])

    const result = await parseFinanceWorkbook(createMockFile())

    expect(result.instruments).toBe(3)
    expect(result.categories).toEqual([
      { name: 'Azioni Europa', count: 2 },
      { name: 'Multi-Asset', count: 1 }
    ])
    expect(result.products).toHaveLength(3)
    expect(result.products[0]).toMatchObject({
      name: 'Alpha Equity',
      category: 'Azioni Europa',
      riskBand: 'Medio',
      description: 'Linea bilanciata'
    })
    expect(result.products[1]).toMatchObject({
      category: 'Azioni Europa',
      riskBand: 'Medio-Bassa'
    })
  })

  it('throws when the workbook has no usable sheets', async () => {
    jest.mocked(read).mockReturnValue({
      SheetNames: [],
      Sheets: {}
    } as unknown as ReturnType<typeof read>)

    await expect(parseFinanceWorkbook(createMockFile())).rejects.toThrow('universo prodotti')
  })
})
