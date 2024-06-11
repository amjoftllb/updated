import { combineReducers } from 'redux';
import authReducers from './action&Reducers/auth.Reducers.js';

const rootReducer = combineReducers({
    user: authReducers,
});

export default rootReducer;
