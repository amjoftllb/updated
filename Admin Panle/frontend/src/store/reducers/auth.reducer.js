const initialState = {
    isAuthenticated: false,
    userData: null,
    error : null
  };
  console.log("initialState",initialState);
  
  function authReducers(state = initialState, action) {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        console.log("initialState",state);
        console.log("action",action);
        return { ...state, isAuthenticated: true, userData: action.payload ,error: null};
      case 'USER_UPDATED':
        return { ...state, isAuthenticated: true, userData: action.payload, error: null }; 
      case 'LOGOUT':
        return { ...state, isAuthenticated: false, userData: null, error: null };    
      default:
        return state;
    }
  }
  
  export default authReducers;