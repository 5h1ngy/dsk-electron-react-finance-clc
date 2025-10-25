import { render, screen } from '@testing-library/react'

import SuggestedProductsCard from './SuggestedProductsCard'
import { useSuggestedProductsCard } from './SuggestedProductsCard.hooks'

jest.mock('./SuggestedProductsCard.hooks', () => ({
  useSuggestedProductsCard: jest.fn()
}))

const mockHook = useSuggestedProductsCard as jest.MockedFunction<
  typeof useSuggestedProductsCard
>

describe('SuggestedProductsCard', () => {
  it('renders recommendations with risk bands', () => {
    mockHook.mockReturnValue({
      title: 'suggestedProducts.title',
      emptyText: 'suggestedProducts.empty',
      recommendations: [
        {
          name: 'Prodotto',
          category: 'Azioni',
          description: 'Descrizione',
          matchReason: 'Motivo',
          riskBand: 'Medio'
        }
      ],
      formatRiskBand: (band: string) => band
    })

    render(<SuggestedProductsCard />)

    expect(screen.getByText('Prodotto')).toBeInTheDocument()
    expect(screen.getByText('Azioni')).toBeInTheDocument()
    expect(screen.getByText('Medio')).toBeInTheDocument()
  })

  it('shows empty state when no recommendations exist', () => {
    mockHook.mockReturnValue({
      title: 'suggestedProducts.title',
      emptyText: 'suggestedProducts.empty',
      recommendations: [],
      formatRiskBand: (band: string) => band
    })

    render(<SuggestedProductsCard />)

    expect(screen.getByText('suggestedProducts.empty')).toBeInTheDocument()
  })
})
