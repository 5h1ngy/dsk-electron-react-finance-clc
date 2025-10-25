import { fireEvent, render, screen } from '@testing-library/react'

import ScoreCard from './ScoreCard'
import { useScoreCard } from './ScoreCard.hooks'

jest.mock('./ScoreCard.hooks', () => ({
  useScoreCard: jest.fn()
}))

const mockHook = useScoreCard as jest.MockedFunction<typeof useScoreCard>

const baseHookValue = {
  title: 'score.title',
  emptyDescription: 'score.empty',
  score: {
    score: 70,
    missingAnswers: [],
    riskClass: 'Prudente',
    volatilityBand: 'Medio',
    rationales: ['reason.1'],
    metadata: {}
  },
  statHighlights: [{ title: 'score.stats.class', value: 'Prudente' }],
  metaDetails: ['detail-1'],
  notes: ['note-1'],
  alertMessage: 'score.messages.missingAnswers',
  missingAnswersDescription: '',
  exportTooltip: undefined,
  exportLabel: 'score.export',
  recomputeLabel: 'score.recompute',
  notesTitle: 'score.notesTitle',
  modalCopy: {
    title: 'score.modal.title',
    description: () => 'desc',
    placeholder: 'score.modal.placeholder',
    confirm: 'score.modal.confirm'
  },
  passwordModalOpen: false,
  password: '',
  setPassword: jest.fn(),
  handleRecompute: jest.fn(),
  handleExportClick: jest.fn(),
  handleModalClose: jest.fn(),
  confirmExport: jest.fn(),
  exporting: false,
  submitting: false,
  certificateFileName: 'cert.p12'
}

describe('ScoreCard', () => {
  it('renders score details and handles actions', () => {
    mockHook.mockReturnValue(baseHookValue)

    render(<ScoreCard />)

    fireEvent.click(screen.getByText('score.recompute'))
    fireEvent.click(screen.getByText('score.export'))
    expect(baseHookValue.handleRecompute).toHaveBeenCalled()
    expect(baseHookValue.handleExportClick).toHaveBeenCalled()
    expect(screen.getByText('note-1')).toBeInTheDocument()
  })

  it('renders empty state when score is missing', () => {
    mockHook.mockReturnValue({
      ...baseHookValue,
      score: null
    })

    render(<ScoreCard />)

    expect(screen.getByText('score.empty')).toBeInTheDocument()
  })
})
