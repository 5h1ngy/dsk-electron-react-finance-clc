import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('react-hook-form', () => ({
  Controller: ({ render }: { render: (props: any) => JSX.Element }) =>
    render({ field: { value: undefined, onChange: jest.fn() } })
}))

import QuestionnaireStepper from './QuestionnaireStepper'
import { useQuestionnaireStepper } from './QuestionnaireStepper.hooks'

jest.mock('./QuestionnaireStepper.hooks', () => ({
  useQuestionnaireStepper: jest.fn()
}))

const mockHook = useQuestionnaireStepper as jest.MockedFunction<
  typeof useQuestionnaireStepper
>

describe('QuestionnaireStepper', () => {
  it('renders questions and forwards navigation events', () => {
    const handleNext = jest.fn()
    mockHook.mockReturnValue({
      copy: {
        title: 'questionnaire.title',
        completion: 'questionnaire.completion',
        reset: 'questionnaire.reset',
        alert: 'questionnaire.alert',
        info: 'questionnaire.info',
        nav: {
          back: 'questionnaire.nav.back',
          next: 'questionnaire.nav.next',
          finish: 'questionnaire.nav.finish'
        }
      },
      progress: { completed: 50 },
      control: { _dummy: true },
      errors: {},
      validationErrors: [],
      handleNext,
      handleBack: jest.fn(),
      handleStepChange: jest.fn(),
      handleReset: jest.fn(),
      currentStep: 0,
      steps: [{ key: 's1', title: 'S1', disabled: false }],
      section: {
        questions: [
          { id: 'q1', label: 'Question 1', type: 'number', required: true }
        ]
      },
      isReady: true,
      isLastStep: false
    })

    render(<QuestionnaireStepper />)

    fireEvent.click(screen.getByRole('button', { name: 'questionnaire.nav.next' }))
    expect(handleNext).toHaveBeenCalled()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
  })
})
