import React, { Children, PropTypes, cloneElement } from 'react'
import isFunction from 'lodash.isfunction'
import { connect } from 'react-redux'
import { setDirtyState, clearDirtyState } from '../actions/dirtyState'
import camelcase from 'lodash.camelcase'

const createSetDirtyStateHandler = (onSetDirtyState, dirtyState) =>
    (newState, onStateSet) =>
      onSetDirtyState(isFunction(newState) ? newState(dirtyState) : newState)
        .then(updatedState => {
          if (isFunction(onStateSet)) {
            onStateSet(updatedState)
          }
        })

export const DirtyState = (props) => {
  const { dirtyKey, [dirtyKey]: dirtyState, onSetDirtyState, onClearDirtyState } = props
  const childProps = {
    [dirtyKey]: dirtyState,
    [camelcase(`set-${dirtyKey}-State`)]: createSetDirtyStateHandler(onSetDirtyState, dirtyState),
    [camelcase(`clear-${dirtyKey}-State`)]: onClearDirtyState
  }
  return (
    <div>
      {Children.map(props.children, child => cloneElement(child, childProps))}
    </div>
  )
}

DirtyState.propTypes = {
  dirtyKey: PropTypes.string.isRequired,
  onSetDirtyState: PropTypes.func.isRequired,
  onClearDirtyState: PropTypes.func.isRequired,
  children: PropTypes.any
}

export const mapStateToProps = dirtyKey => ({ dirtyState: globalDirtyState }) => {
  return {
    dirtyKey,
    [dirtyKey]: globalDirtyState[dirtyKey]
  }
}

export const mapDispatchToProps = (dirtyKey, onSetDirtyState, onClearDirtyState) => dispatch => {
  return {
    onSetDirtyState: state => onSetDirtyState(dirtyKey, state)(dispatch),
    onClearDirtyState: () => onClearDirtyState(dirtyKey)(dispatch)
  }
}

export default dirtyKey => connect(
  mapStateToProps(dirtyKey),
  mapDispatchToProps(dirtyKey, setDirtyState, clearDirtyState)
)(DirtyState)
