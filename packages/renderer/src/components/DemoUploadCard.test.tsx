import { render, screen } from '@testing-library/react'

import DemoUploadCard from './DemoUploadCard'
import { useDemoUploadCard } from './DemoUploadCard.hooks'

jest.mock('./DemoUploadCard.hooks', () => ({
  useDemoUploadCard: jest.fn()
}))

const mockHook = useDemoUploadCard as jest.MockedFunction<typeof useDemoUploadCard>

describe('DemoUploadCard', () => {
  it('renders draggers with copy coming from the hook', () => {
    mockHook.mockReturnValue({
      copy: {
        title: 'demoUpload.title',
        description: 'demoUpload.description',
        drop: {
          questionnaire: {
            title: 'q-title',
            hint: 'q-hint'
          },
          products: {
            title: 'p-title',
            hint: 'p-hint'
          },
          pdf: {
            title: 'pdf-title',
            hint: 'pdf-hint'
          }
        },
        listTitle: 'demoUpload.list.title'
      },
      listItems: ['item-1', 'item-2'],
      handleQuestionnaireUpload: jest.fn(),
      handleFinanceUpload: jest.fn(),
      handlePdfUpload: jest.fn()
    })

    render(<DemoUploadCard />)

    expect(screen.getByText('demoUpload.title')).toBeInTheDocument()
    expect(screen.getByText('item-1')).toBeInTheDocument()
    expect(screen.getByText('pdf-title')).toBeInTheDocument()
  })
})
