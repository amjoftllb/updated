// src/store/store.ts
import { createStore } from 'redux';
import { appReducer } from './reducers';

const store = createStore(appReducer);

export default store;

export type AppDispatch = typeof store.dispatch;
