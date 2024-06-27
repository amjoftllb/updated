
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer/rootReducer";
import { thunk } from "redux-thunk"; // Correct named import
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import { ThunkAction, ThunkDispatch } from "redux-thunk"; // Correct types for thunks

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Chat"],
};

const persistedReducer = persistReducer<any, any>(persistConfig, reducer);

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  typeof reducer,
  unknown,
  any
>;
