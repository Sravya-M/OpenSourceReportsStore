//Root reducer
import { combineReducers } from 'redux';
import itemReducer from './ItemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import reportReducer from './reportReducer';

export default combineReducers({
	item: itemReducer,
	error: errorReducer,
	auth: authReducer,
	report: reportReducer
});