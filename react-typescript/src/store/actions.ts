// src/store/actions.ts
import { ActionTypes, AppActions } from './types';

export const increment = (): AppActions => ({
  type: ActionTypes.INCREMENT,
});

export const decrement = (): AppActions => ({
  type: ActionTypes.DECREMENT,
});
