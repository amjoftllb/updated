import { combineReducers } from 'redux';
import authReducers from './reducers/auth.reducer.js';

const rootReducer = combineReducers({
    user: authReducers,
});

export default rootReducer;