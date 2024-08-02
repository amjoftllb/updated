// src/store/reducers.ts
import { AppState, AppActions, ActionTypes } from './types';

const initialState: AppState = {
  counter: 0,
};

export const appReducer = (state = initialState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, counter: state.counter + 1 };
    case ActionTypes.DECREMENT:
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};
