import React, { PropTypes } from 'react'
import dirtyState from './DirtyState'

const Provider = ({ dirtyKey, children }) => {
  const DirtyStateComponent = dirtyState(dirtyKey)
  return (
    <DirtyStateComponent>
      {children}
    </DirtyStateComponent>
  )
}

Provider.propTypes = {
  dirtyKey: PropTypes.string.isRequired,
  children: PropTypes.any
}

export default Provider
