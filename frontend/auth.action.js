import axios from "axios";

export const loginUser = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data});
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data.message });
    }
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
    try {
      const response = await axios.post("/api/logOut");
      dispatch({ type: 'LOGOUT_SUCCESS', payload: response.data});
    } catch (error) {
      dispatch({ type: 'LOGOUT_FAILURE', payload: error.response.data.message });
    }
  };
};
