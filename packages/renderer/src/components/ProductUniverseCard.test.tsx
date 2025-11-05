import { render, screen } from '@testing-library/react'

import ProductUniverseCard from './ProductUniverseCard'
import { useProductUniverseCard } from './ProductUniverseCard.hooks'

jest.mock('./ProductUniverseCard.hooks', () => ({
  useProductUniverseCard: jest.fn()
}))

const mockHook = useProductUniverseCard as jest.MockedFunction<typeof useProductUniverseCard>

describe('ProductUniverseCard', () => {
  it('renders category list when products are available', () => {
    mockHook.mockReturnValue({
      title: 'productUniverse.title',
      statLabel: 'productUniverse.stat',
      emptyText: 'productUniverse.empty',
      categories: [
        { name: 'Azioni', count: 2 },
        { name: 'Obbligazionari', count: 1 }
      ],
      productCount: 3
    })

    render(<ProductUniverseCard />)

    expect(screen.getByText('productUniverse.title')).toBeInTheDocument()
    expect(screen.getByText('Azioni')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows the empty state when no products are present', () => {
    mockHook.mockReturnValue({
      title: 'productUniverse.title',
      statLabel: 'productUniverse.stat',
      emptyText: 'productUniverse.empty',
      categories: [],
      productCount: 0
    })

    render(<ProductUniverseCard />)

    expect(screen.getByText('productUniverse.empty')).toBeInTheDocument()
  })
})
