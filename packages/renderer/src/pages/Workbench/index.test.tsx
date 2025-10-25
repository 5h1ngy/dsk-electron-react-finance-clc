import { render, screen } from '@testing-library/react'

jest.mock('@renderer/components/CertificateCard', () => () => <div>CertificateCard</div>)
jest.mock('@renderer/components/DemoUploadCard', () => () => <div>DemoUploadCard</div>)
jest.mock('@renderer/components/QuestionnaireStepper', () => () => (
  <div>QuestionnaireStepper</div>
))
jest.mock('@renderer/components/ScoreCard', () => () => <div>ScoreCard</div>)
jest.mock('@renderer/components/SectionCompletionCard', () => () => (
  <div>SectionCompletionCard</div>
))
jest.mock('@renderer/components/SuggestedProductsCard', () => () => (
  <div>SuggestedProductsCard</div>
))

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
