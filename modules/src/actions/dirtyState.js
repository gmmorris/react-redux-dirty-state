
export const setDirtyState = (stateKey, payload) => {
  return dispatch => new Promise((resolve, reject) => {
    resolve(dispatch({
      type: 'SET_DIRTY_STATE',
      stateKey,
      payload
    }))
  })
}

export const clearDirtyState = (stateKey) => {
  return dispatch => new Promise((resolve, reject) => {
    resolve(dispatch({
      type: 'CLEAR_DIRTY_STATE',
      stateKey
    }))
  })
}
