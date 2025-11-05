import { render, screen } from '@testing-library/react'

const createComponentMock = (label: string) => {
  const Component = () => <div>{label}</div>
  Component.displayName = `${label}Mock`
  return Component
}

jest.mock('@renderer/components/CertificateCard', () => createComponentMock('CertificateCard'))
jest.mock('@renderer/components/DemoUploadCard', () => createComponentMock('DemoUploadCard'))
jest.mock('@renderer/components/QuestionnaireStepper', () =>
  createComponentMock('QuestionnaireStepper')
)
jest.mock('@renderer/components/ScoreCard', () => createComponentMock('ScoreCard'))
jest.mock('@renderer/components/SuggestedProductsCard', () =>
  createComponentMock('SuggestedProductsCard')
)
jest.mock('@renderer/components/QuestionnaireStepper.Switcher', () =>
  createComponentMock('QuestionnaireStepperSwitcher')
)

const mockStepperModel = {
  copy: {
    title: 'Questionnaire',
    completion: 'Completion',
    reset: 'Reset',
    alert: 'Alert',
    info: 'Info',
    nav: { back: 'Back', next: 'Next', finish: 'Finish' }
  },
  progress: { completed: 0, required: 0 },
  control: {} as never,
  errors: {},
  validationErrors: [],
  handleNext: jest.fn(),
  handleBack: jest.fn(),
  handleStepChange: jest.fn(),
  handleReset: jest.fn(),
  currentStep: 0,
  steps: [],
  section: { questions: [] },
  isReady: true,
  schema: { sections: [] },
  isLastStep: false,
  sectionsProgress: []
}

jest.mock('@renderer/components/QuestionnaireStepper.hooks', () => ({
  useQuestionnaireStepper: jest.fn(() => mockStepperModel)
}))

import ProfilationPage from './index'
import { useProfilationPage } from './useProfilationPage'

jest.mock('./useProfilationPage', () => ({
  useProfilationPage: jest.fn()
}))

describe('ProfilationPage', () => {
  it('renders the dashboard layout', () => {
    render(<ProfilationPage />)

    expect(screen.getByText('DemoUploadCard')).toBeInTheDocument()
    expect(useProfilationPage).toHaveBeenCalled()
  })
})
