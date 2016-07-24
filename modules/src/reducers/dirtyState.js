import omit from 'lodash.omit'

const dirtyState = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DIRTY_STATE':
      return Object.assign({}, state, {
        [action.stateKey]: action.payload
      })
    case 'CLEAR_DIRTY_STATE':
      return omit(state, action.stateKey)
    default:
      return state
  }
}

export default dirtyState
