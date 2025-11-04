jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => 'dispatch'),
  useSelector: jest.fn((selector) => selector({})),
  TypedUseSelectorHook: jest.fn()
}))

import { useDispatch, useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from './hooks'

describe('store hooks', () => {
  it('proxy react-redux hooks with proper typing', () => {
    expect(useAppDispatch()).toBe('dispatch')
    const selector = jest.fn().mockReturnValue('state')
    expect(useAppSelector(selector)).toBe('state')
    expect(useDispatch).toHaveBeenCalled()
    expect(useSelector).toHaveBeenCalled()
  })
})
