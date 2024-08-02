// src/store/types.ts
export interface AppState {
    counter: number;
  }
  
  export enum ActionTypes {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT',
  }
  
  interface IncrementAction {
    type: ActionTypes.INCREMENT;
  }
  
  interface DecrementAction {
    type: ActionTypes.DECREMENT;
  }
  
  export type AppActions = IncrementAction | DecrementAction;
  