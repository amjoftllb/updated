import { combineReducers } from "redux";
import { Chats } from "./chat";
const rootReducer = combineReducers({
  Chats: Chats,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
