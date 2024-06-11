// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './rootReducer.js';

const store = createStore(combineReducers({ rootReducer }),applyMiddleware(thunk));

export default store;
