import reducer from '../../src/reducers/dirtyState'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import { stub } from 'sinon'
const { describe, it } = global

chai.use(sinonChai)

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(
      {}
    )
  })

  it('should handle SET_DIRTY_STATE', () => {
    const STATE_KEY = 'dirtyTodo'
    const STATE = {
      title: 'My todo'
    }

    expect(
      reducer({}, {
        type: 'SET_DIRTY_STATE',
        stateKey: STATE_KEY,
        payload: STATE
      })
    ).to.deep.equal(
      {
        [STATE_KEY]: STATE
      }
    )
  })

  it('should handle SET_DIRTY_STATE alongside existing state', () => {
    const INITIAL_STATE = {
      existingState: {
        magic: true
      }
    }

    const STATE_KEY = 'dirtyTodo'
    const STATE = {
      title: 'My todo'
    }

    expect(
      reducer(INITIAL_STATE, {
        type: 'SET_DIRTY_STATE',
        stateKey: STATE_KEY,
        payload: STATE
      })
    ).to.deep.equal(
      {
        ...INITIAL_STATE,
        [STATE_KEY]: STATE
      }
    )
  })

  it('should handle CLEAR_DIRTY_STATE on an empty state', () => {
    const STATE_KEY = 'dirtyTodo'

    expect(
      reducer({}, {
        type: 'CLEAR_DIRTY_STATE',
        stateKey: STATE_KEY
      })
    ).to.deep.equal(
      {}
    )
  })

  it('should handle CLEAR_DIRTY_STATE on existing dirty state', () => {
    const STATE_KEY = 'dirtyTodo'

    expect(
      reducer({
        [STATE_KEY]: 'Some state'
      }, {
        type: 'CLEAR_DIRTY_STATE',
        stateKey: STATE_KEY
      })
    ).to.deep.equal(
      {}
    )
  })

  it('should handle CLEAR_DIRTY_STATE alongside existing state', () => {
    const INITIAL_STATE = {
      existingState: {
        magic: true
      }
    }

    const STATE_KEY = 'dirtyTodo'

    expect(
      reducer(INITIAL_STATE, {
        type: 'CLEAR_DIRTY_STATE',
        stateKey: STATE_KEY
      })
    ).to.deep.equal(
      {
        ...INITIAL_STATE
      }
    )
  })
})
