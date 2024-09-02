
export const FETCH_AUTH_STATUS = 'FETCH_AUTH_STATUS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOAD_CHAT = 'LOAD_CHAT';
export const SET_MESSAGES = 'SET_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';


export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT_SUCCESS,
});


export const loadchat = (chat) => ({
  type: LOAD_CHAT,
  payload: chat,
});

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  payload: messages,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});


import axios from "axios";

export const loginUser = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      dispatch({ type: FETCH_AUTH_STATUS, payload: response.data});
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data.message });
    }
  };
};

