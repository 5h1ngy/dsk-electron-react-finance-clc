import { act, renderHook } from '@testing-library/react'

import { useQuestionnaireStepper } from './QuestionnaireStepper.hooks'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { resetQuestionnaire } from '@renderer/store/slices/questionnaire'

jest.mock('@renderer/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    reset: jest.fn(),
    handleSubmit:
      (onValid: () => void) =>
      async () =>
        onValid(),
    formState: { errors: {} }
  })
}))

describe('useQuestionnaireStepper', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    mockDispatch.mockReset()
  })

  it('builds steps from the schema and resets questionnaire state', async () => {
    const schema = {
      schemaVersion: '1',
      title: 'Questionario',
      sections: [
        { id: 's1', label: 'Sezione 1', questions: [] },
        { id: 's2', label: 'Sezione 2', questions: [] }
      ]
    }

    jest
      .mocked(useAppSelector)
      .mockReturnValueOnce(schema)
      .mockReturnValueOnce('ready')
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ completed: 0 })

    const { result } = renderHook(() => useQuestionnaireStepper())

    expect(result.current.steps).toHaveLength(2)
    await act(async () => {
      result.current.handleReset()
    })
    expect(mockDispatch).toHaveBeenCalledWith(resetQuestionnaire())
  })
})
