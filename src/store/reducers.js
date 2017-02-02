import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form';
import locationReducer from './location'
import modelReducer from './model'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    form,
    location: locationReducer,
    model: modelReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
