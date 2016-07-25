import React from 'react'
import { shallow, mount } from 'enzyme'
import { DirtyState, mapStateToProps, mapDispatchToProps } from '../../src/containers/DirtyState'
import { expect } from 'chai'
import { stub } from 'sinon'
const { describe, it } = global

describe('mapStateToProps', () => {
  it('be a higher order function', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'

    expect(
      mapStateToProps(DIRTY_STATE_KEY)
    ).to.be.a(
      'function'
    )
  })

  it('provides a dirtyKey property', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const STATE = {
      dirtyState: {
        [DIRTY_STATE_KEY]: {
          title: 'My Todo'
        }
      }
    }

    expect(
      mapStateToProps(DIRTY_STATE_KEY)(STATE).dirtyKey
    ).to.deep.equal(DIRTY_STATE_KEY)
  })

  it('provides a the dirty state under the dirtyKey as a property', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const STATE = {
      dirtyState: {
        [DIRTY_STATE_KEY]: {
          title: 'My Todo'
        }
      }
    }

    expect(
      mapStateToProps(DIRTY_STATE_KEY)(STATE)[DIRTY_STATE_KEY]
    ).to.deep.equal(
      STATE.dirtyState[DIRTY_STATE_KEY]
    )
  })

  it('provides a the dirty state under the dirtyKey as a property even when none exists', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const STATE = {
      dirtyState: {}
    }

    expect(
      mapStateToProps(DIRTY_STATE_KEY)(STATE)
    ).to.deep.equal(
      {
        dirtyKey: DIRTY_STATE_KEY,
        [DIRTY_STATE_KEY]: undefined
      }
    )
  })
})

describe('mapDispatchToProps', () => {
  it('be a higher order function which expects to receive s dispatcher', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'

    expect(
      mapDispatchToProps(DIRTY_STATE_KEY)
    ).to.be.a(
      'function'
    )

    const dispatcher = () => {}
    const mappedWithDispatcher = mapDispatchToProps(DIRTY_STATE_KEY)(dispatcher)
    expect(
      mappedWithDispatcher
    ).to.include.keys(
      'onSetDirtyState',
      'onClearDirtyState'
    )
  })

  it('provides a onSetDirtyState property', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const STATE = {
      title: 'My Todo'
    }
    const onSetDirtyState = stub().returns(() => {})

    expect(
      mapDispatchToProps(DIRTY_STATE_KEY, onSetDirtyState)().onSetDirtyState
    ).to.be.a(
      'function'
    )

    mapDispatchToProps(DIRTY_STATE_KEY, onSetDirtyState)().onSetDirtyState(STATE)
    expect(
      onSetDirtyState
    ).to.have.been.calledWith(
      DIRTY_STATE_KEY,
      STATE
    )
  })

  it('provides a onSetDirtyState property whose returned function is called with the provided dispatcher', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const onSetDirtyState = function () {
      return function (passedDispatch) {
        passedDispatch()
      }
    }

    const dispatch = stub()

    mapDispatchToProps(DIRTY_STATE_KEY, onSetDirtyState)(dispatch).onSetDirtyState()
    expect(
      dispatch
    ).to.have.been.calledOnce
  })

  it('provides a onClearDirtyState property', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const onClearDirtyState = stub().returns(() => {})

    expect(
      mapDispatchToProps(DIRTY_STATE_KEY, () => {}, onClearDirtyState)().onClearDirtyState
    ).to.be.a(
      'function'
    )

    mapDispatchToProps(DIRTY_STATE_KEY, () => {}, onClearDirtyState)().onClearDirtyState()
    expect(
      onClearDirtyState
    ).to.have.been.calledWith(
      DIRTY_STATE_KEY
    )
  })

  it('provides a onClearDirtyState property whose returned function is called with the provided dispatcher', () => {
    const DIRTY_STATE_KEY = 'dirtyTodo'
    const onClearDirtyState = function () {
      return function (passedDispatch) {
        passedDispatch()
      }
    }

    const dispatch = stub()

    mapDispatchToProps(DIRTY_STATE_KEY, () => {}, onClearDirtyState)(dispatch).onClearDirtyState()
    expect(
      dispatch
    ).to.have.been.calledOnce
  })
})

describe('DirtyState', () => {
  it('is receives a dirtyKey prop and passes whatever prop it has under that name to its children', () => {
    const dirtyKey = 'dirtyTodo'
    const dirtyTodo = {
      title: 'My Todo'
    }

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} dirtyTodo={dirtyTodo} onSetDirtyState={stub()} onClearDirtyState={stub()}>
        <span />
        <label />
      </DirtyState>
    )

    expect(wrapper.find('span')).to.have.length(1)
    expect(
      wrapper.find('span').prop(dirtyKey)
    ).to.deep.equal(
      dirtyTodo
    )

    expect(wrapper.find('label')).to.have.length(1)
    expect(
      wrapper.find('label').prop(dirtyKey)
    ).to.deep.equal(
      dirtyTodo
    )
  })

  it('is provides its children with a specific setState for the dirtyKey', () => {
    const dirtyKey = 'dirtyTodo'
    const onSetDirtyState = stub()

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} onSetDirtyState={onSetDirtyState} onClearDirtyState={stub()}>
        <span />
      </DirtyState>
    )

    const setState = wrapper.find('span').prop('setDirtyTodoState')
    expect(
      setState
    ).to.be.a(
      'function'
    )
  })

  it('should call the onSetDirtyState function prop when the special setState method is called when a new state is passed to it', () => {
    const dirtyKey = 'dirtyTodo'
    const onSetDirtyState = stub().returns(Promise.resolve())

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} onSetDirtyState={onSetDirtyState} onClearDirtyState={stub()}>
        <span />
      </DirtyState>
    )

    const STATE = {
      title: 'My Todo'
    }
    const setState = wrapper.find('span').prop('setDirtyTodoState')
    setState(STATE)
    expect(
      onSetDirtyState
    ).to.have.been.calledWith(
      STATE
    )
  })

  it('should call the onSetDirtyState function prop when the special setState method is called when a state function is passed to it', () => {
    const dirtyKey = 'dirtyTodo'
    const dirtyTodo = {
      title: 'My Todo'
    }
    const onSetDirtyState = stub().returns(Promise.resolve())

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} dirtyTodo={dirtyTodo} onSetDirtyState={onSetDirtyState} onClearDirtyState={stub()}>
        <span />
      </DirtyState>
    )

    const STATE_FUNCTION = function (currentState) {
      expect(
        currentState
      ).to.deep.equal(
        dirtyTodo
      )
      return dirtyTodo
    }

    const setState = wrapper.find('span').prop('setDirtyTodoState')
    setState(STATE_FUNCTION)
    expect(
      onSetDirtyState
    ).to.have.been.calledWith(
      dirtyTodo
    )
  })

  it('should call a onStateSet callback when the promise from the onSetDirtyState resolves on set', (done) => {
    const dirtyKey = 'dirtyTodo'
    const dirtyTodo = {
      title: 'My Todo'
    }
    const onSetDirtyState = stub().returns(Promise.resolve(dirtyTodo))
    const onStateHasBeenSet = stub()

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} dirtyTodo={dirtyTodo} onSetDirtyState={onSetDirtyState} onClearDirtyState={stub()}>
        <span />
      </DirtyState>
    )

    const STATE_FUNCTION = function (currentState) {
      return dirtyTodo
    }

    const setState = wrapper.find('span').prop('setDirtyTodoState')
    setState(STATE_FUNCTION, onStateHasBeenSet)
      .then(() => {
        expect(
          onStateHasBeenSet
        ).to.have.been.calledWith(
          dirtyTodo
        )
        done()
      })
  })

  it('is provides its children with a specific clearState for the dirtyKey', () => {
    const dirtyKey = 'dirtyTodo'
    const onClearDirtyState = stub()

    const wrapper = shallow(
      <DirtyState dirtyKey={dirtyKey} onSetDirtyState={stub()} onClearDirtyState={onClearDirtyState}>
        <span />
      </DirtyState>
    )

    expect(
      wrapper.find('span').prop('clearDirtyTodoState')
    ).to.deep.equal(
      onClearDirtyState
    )
  })
})
