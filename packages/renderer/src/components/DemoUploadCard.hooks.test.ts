import { renderHook } from '@testing-library/react'

import { useDemoUploadCard } from './DemoUploadCard.hooks'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'

jest.mock('@renderer/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('@engines/importers/financeWorkbook', () => ({
  parseFinanceWorkbook: jest.fn()
}))
jest.mock('@engines/importers/requestWorkbook', () => ({
  parseQuestionnaireWorkbook: jest.fn()
}))
jest.mock('@engines/importers/pdfQuestionnaire', () => ({
  parseQuestionnairePdf: jest.fn()
}))

describe('useDemoUploadCard', () => {
  beforeEach(() => {
    jest.mocked(useAppDispatch).mockReturnValue(jest.fn())
    jest.mocked(useAppSelector)
      .mockReset()
      .mockReturnValue(undefined)
  })

  it('builds copy and list items based on selector data', () => {
    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce({ sections: [], schemaVersion: '1', title: 'Schema' })
      .mockReturnValueOnce({ fileName: 'questionario.xlsx', responses: 12 })
      .mockReturnValueOnce({ fileName: 'prodotti.xlsx', instruments: 4 })
      .mockReturnValueOnce({ fileName: 'questionario.pdf', pages: 2 })

    const { result } = renderHook(() => useDemoUploadCard())

    expect(result.current.copy.title).toBe('demoUpload.title')
    expect(result.current.listItems).toEqual(
      expect.arrayContaining([
        expect.stringContaining('questionario.xlsx'),
        expect.stringContaining('questionario.pdf'),
        expect.stringContaining('prodotti.xlsx')
      ])
    )
  })
})
