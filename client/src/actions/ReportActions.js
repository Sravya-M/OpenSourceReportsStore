import axios from 'axios';
import { GET_REPORTS, ADD_REPORT, DELETE_REPORT, REPORTS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getReports = () => dispatch => {
	dispatch(setReportsLoading());
	axios
		.get('/api/reports')
		.then(res =>
			dispatch({
				type: GET_REPORTS,
				payload: res.data
			}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addReport = (report) => (dispatch, getState) => {
	console.log (report)
	axios
		.post('/api/reports', report, tokenConfig(getState))
		.then(res =>
			dispatch({
				type: ADD_REPORT,
				payload: res.data
			}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

};

export const deleteReport = (id) => (dispatch, getState) => {
	axios
		.delete(`/api/reports/${id}`, tokenConfig(getState))
		.then(res =>
			dispatch({
				type: DELETE_REPORT,
				payload: id
			}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const setReportsLoading = () => {
	return {
		type: REPORTS_LOADING
	};
};