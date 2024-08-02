// src/App.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from './store/types';
import { increment, decrement } from './store/actions';
import {AppDispatch} from "../src/store/store"

const App: React.FC = () => {
  const counter = useSelector((state: AppState) => state.counter);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default App;
