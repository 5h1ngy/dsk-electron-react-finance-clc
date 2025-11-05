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
          products: {
            title: 'p-title',
            hint: 'p-hint'
          },
          pdf: {
            title: 'pdf-title',
            hint: 'pdf-hint'
          }
        },
        status: { idle: 'status-idle' },
        labels: { products: 'prod-label', pdf: 'pdf-label' },
        empty: { products: 'prod-empty', pdf: 'pdf-empty' }
      },
      handleFinanceUpload: jest.fn(),
      handlePdfUpload: jest.fn(),
      status: null,
      financeImport: undefined,
      pdfImport: undefined
    })

    render(<DemoUploadCard />)

    expect(screen.getByText('demoUpload.title')).toBeInTheDocument()
    expect(screen.getByText('pdf-title')).toBeInTheDocument()
  })
})
