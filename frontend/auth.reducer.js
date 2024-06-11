const initialState = {
  isAuthenticated: false,
  userData: null,
  error : null
};

function authReducers(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, userData: action.payload.data ,error: null};
    case 'LOGIN_FAILURE':
      return { ...state, isAuthenticated: false, userData: null, error: action.payload };
    case 'USER_UPDATED':
      return { ...state, isAuthenticated: true, userData: action.payload, error: null }; 
    case 'LOGOUT_SUCCESS':
      return { ...state, isAuthenticated: false, userData: null, error: null };    
    default:
      return state;
  }
}

export default authReducers;
