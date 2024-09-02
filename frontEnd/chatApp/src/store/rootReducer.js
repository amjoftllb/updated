
import {
  FETCH_AUTH_STATUS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOAD_CHAT,
  SET_MESSAGES,
  ADD_MESSAGE,
} from './actions';

const initialState = {
  authStatus: false,
  user: null,
  ChatReciver: null,
  chatMessages: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_STATUS:
      return { ...state, user: action.payload, authStatus: true };
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, authStatus: true };
    case LOGOUT_SUCCESS:
      return { ...state, user: null, authStatus: false };
    case LOAD_CHAT:
      return { ...state, ChatReciver: action.payload };
    case SET_MESSAGES:
      return { ...state, chatMessages: action.payload };
    case ADD_MESSAGE:
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    default:
      return state;
  }
};

export default rootReducer;
