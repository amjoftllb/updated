import axios from "axios";

export const loginUser = (data) => {

  return (dispatch) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: data});
  };
};

export const updateUser = (data) => {
  console.log("store data ",data);
  return async (dispatch) => {
    dispatch({ type: 'USER_UPDATED', payload: data });
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    const response = await axios.post("/api/logOut");
    dispatch({ type: 'LOGOUT', payload: null});
  };
};