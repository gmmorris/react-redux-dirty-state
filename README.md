# React Redux Dirty State Component

React Redux Dirty State Component

A little <i class="icon-cog"></i> **Utility** Component meant to standardise the way in which _dirty state_ is created in your react-redux application. 
The goal of the module is to simplify the usecase where you need a component to hold some kind of dirty state, such as in the case of a form where the user input needs to be stored somewhere, but isn't _real_ data yet, but rather _dirty_, but we'd still want it stored in our Redux store in order to maintain our *single source of truth*.

----------
## Installation

**First** you need to install the module.
`npm i -s react-redux-dirty-state`

**Second** you need to introduce the DirtyState Reducer into your redux store's root reducer. We'll be assuming that you're using Redux's _combineReducers_ to build your root reducer, and the followup assumption is that, if you're not using _combineReducers_ then you know what you're doing and can figure out how to compose our reducer into your root reducer.
An implicit assumption is made that the key for the reducer is *dirtyState* and that assumption is baked into our _mapStateToProps_ method, so it's important you maintain this assumption.

```javascript
import {createStore, combineReducers} from 'redux';
import { dirtyState } from 'react-redux-dirty-state';

const rootReducer = combineReducers({
  // ... your other reducers here ...
  dirtyState
});
const store = createStore(rootReducer);
```

You now ready to go and can start defining either Providers or DirtyState components, and you can learn how to do that by looking at the API documentation bellow.

**API**
The _react-redux-dirty-state_ module exposes three components:

## DirtyState Component
_default export_
The _default export_ of the module is the core Higher-Order Component which allows you to wrap any child components and pass down to them the methods needed to *set* or *clear* the dirty state.

The idea is that you can use the HOC to create your own Dirty State component which is tailored to a specific part of your component tree.
For example, if we wish to add dirty state to our TodoApp (look at the examples folder in the repo), we might want to add it around our AddTodo component, which provides a UI for adding a Todo item.
We'll do so by first creating our Dirty State component like so:
```javascript
/* DirtyTodoPromider.js */
import React from 'react'
import DirtyState from 'react-redux-dirty-state'
const dirtyKey = 'dirtyTodo'
export default DirtyState(dirtyKey)
```
 This defines a component which interacts with a piece of dirty state, under the dirtyTodo key.
 We can then wrap our AddTodo component's instantiation with our new component:
```javascript
...
import AddTodo from '../containers/AddTodo'
import DirtyTodoProvider from '../containers/DirtyTodoProvider'
...

const App = () => (
  <div>
    <DirtyTodoProvider>
      <AddTodo />
    </DirtyTodoProvider>
  </div>
)

export default App
```

This is all we need to do to provide our AddTodo component with access to the dirty state.
Now we need to actually make use of this new magical state.

In our AddTodo Component we first add the required PropTypes:
```javascript
AddTodo.propTypes = {
  dirtyTodo: PropTypes.any.isRequired,
  setDirtyTodoState: PropTypes.func.isRequired,
  clearDirtyTodoState: PropTypes.func.isRequired
}
```

You may be wondering where those **set** and **clear** methods have come from.
When you define a Provider using our Higher Order Component, such as our _DirtyTodoProvider_ example, the provider will use the **dirtyKey** prop we pass it's constructor to define three properties which it will be passing to its children:

 1. A property for the actual dirty state, which allows our child components to use the dirty state for their rendering. This property will be named the same as the value of the dirtyKey property/argument. So in our example, that prop will be named *dirtyTodo*.
 2. A setState function which allows us the set the dirty state directly from the app. The reasoning is this *setState* function can be used in the same way that React's regular *setState* is used for local state, with the only exception being that under the hood it actually uses the redux store to hold the data, via an action creator which is tailored to the specific dirtyKey in the state. The name of this *setState* function is generated based on the key, so that you can have multiple dirty states used in a single child component without them clashing.
 3. A clearState function, whose name is also generated based on the dirtyKey, which when called will remove the dirty state from the store. Usually this would be called manually by one of your components when they unmount. 

Now that our AddTodo component knows how to receive the dirty state and the two functions for manipulating it, we can plug these into the UI:
```javascript

let AddTodo = ({ dispatch, setDirtyTodoState, clearDirtyTodoState, dirtyTodo }) => {
/*
	Here we'll use the setDirtyTodoState to create out dirty todo object whenever the user changes the content of our input field, ensuring it is stored in our redux store
*/
  const handleOnChange = e => setDirtyTodoState({ value: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    /*
    Here we make sure that once our addTodo action creator resolves from it's being dispatched to the store for permanent storage, we clear our dirty state so that it doesn't bloat up our store
    */
    if (dirtyTodo && dirtyTodo.value && dirtyTodo.value.trim()) {
      dispatch(addTodo(dirtyTodo.value))
        .then(clearDirtyTodoState())
      return true
    }
    return false
  }
/*
Here, in the component's rendered DOM we plug the input field into the *dirtyTodo* state, so that it is kept in sync, via two-way binding with our dirtyState
*/
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input onChange={handleOnChange} value={dirtyTodo && dirtyTodo.value ? dirtyTodo.value : ''} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
```

## Provider Component
_DirtyStateProvider_
A _named export_ component, under the name **DirtyStateProvider**, which  allows us easy access to our Higher Order Component which allows us to create a DirtyState component without having to define it manually like we did in our *DirtyTodoPromider.js* file.

Usage:
```javascript
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import { DirtyStateProvider } from 'react-redux-dirty-state'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <DirtyStateProvider dirtyKey="dirtyTodo">
      <AddTodo />
    </DirtyStateProvider>
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
```
As you can see our *App.js* file remains the same in this case, but instead of importing the DirtyTodoProvider Component, we import our DirtyStateProvider component, add it into our component tree with a hard coded property:
```javascript
dirtyKey="dirtyTodo"
```
And then wrap our AddTodo component with this new provider.
Under the hood the exact same thin will happen, but this saves us having to define our component separately.
You may find this a simpler and more concise way of creating and manipulating dirty state, when the dirty state is only needed in one specific leaf of your your component tree.
We would think that is actually a more common use case for our component, but do let us know your experience and usage of it.

## Our Reducer
_dirtyState_
The last export in our module is the actual reducer which we need in order to plug our DirtyState component into our redux store. Exported under the name **dirtyState** in order to make the import more streamlined and easier to use with *combineReducers*, this is actually the first piece of the puzzle, and if it isn't integrated correctly will prevent the whole DirtyState component from working. Please make sure you follow the **Installation** section correctly.