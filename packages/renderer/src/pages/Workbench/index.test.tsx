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
jest.mock('@renderer/components/SectionCompletionCard', () =>
  createComponentMock('SectionCompletionCard')
)
jest.mock('@renderer/components/SuggestedProductsCard', () =>
  createComponentMock('SuggestedProductsCard')
)

import WorkbenchPage from './index'
import { useWorkbenchPage } from './hooks'

jest.mock('./hooks', () => ({
  useWorkbenchPage: jest.fn()
}))

describe('WorkbenchPage', () => {
  it('renders the dashboard layout', () => {
    render(<WorkbenchPage />)

    expect(screen.getByText('DemoUploadCard')).toBeInTheDocument()
    expect(useWorkbenchPage).toHaveBeenCalled()
  })
})
