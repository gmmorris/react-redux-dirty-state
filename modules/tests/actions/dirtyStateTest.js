import { setDirtyState, clearDirtyState } from '../../src/actions/dirtyState'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import { stub } from 'sinon'
const { describe, it } = global

chai.use(sinonChai)

describe('setDirtyState', () => {
  it('should be a thunk', () => {
    const calledAction = setDirtyState()
    expect(calledAction).to.be.a('function')
  })

  it('should return a promise', () => {
    const dispatch = stub()
    const dispatchedAction = setDirtyState()(dispatch)
    expect(dispatchedAction).to.be.a('promise')
    expect(dispatch).to.have.been.calledOnce
  })

  it('should take a state key and state value and dispatch a request to set it', () => {
    const STATE_KEY = 'dirtyTodo'
    const STATE = {
      title: 'My todo'
    }

    const calledAction = setDirtyState(STATE_KEY, STATE)
    const dispatch = stub()
    calledAction(dispatch)

    expect(dispatch).to.have.been.calledOnce
    expect(dispatch).to.have.been.calledWith({
      type: 'SET_DIRTY_STATE',
      stateKey: STATE_KEY,
      payload: STATE
    })
  })
})

describe('clearDirtyState', () => {
  it('should be a thunk', () => {
    const calledAction = clearDirtyState()
    expect(calledAction).to.be.a('function')
  })

  it('should return a promise', () => {
    const dispatch = stub()
    const dispatchedAction = clearDirtyState()(dispatch)
    expect(dispatchedAction).to.be.a('promise')
    expect(dispatch).to.have.been.calledOnce
  })

  it('should take a state key and dispatch a request to clear it', () => {
    const STATE_KEY = 'dirtyTodo'

    const calledAction = clearDirtyState(STATE_KEY)
    const dispatch = stub()
    calledAction(dispatch)

    expect(dispatch).to.have.been.calledOnce
    expect(dispatch).to.have.been.calledWith({
      type: 'CLEAR_DIRTY_STATE',
      stateKey: STATE_KEY
    })
  })
})
