import dirtyStateReducer from './reducers/dirtyState'
import component from './containers/DirtyState'
import Provider from './containers/Provider'

export default component
export const dirtyState = dirtyStateReducer
export const DirtyStateProvider = Provider
