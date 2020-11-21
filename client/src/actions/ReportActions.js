import axios from 'axios';
import { GET_REPORTS, ADD_REPORT, DELETE_REPORT, REPORTS_LOADING , VIEW_REPORT, DOWNLOAD_REPORT} from './types';
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

export const viewReport = (filename) => (dispatch, getState) => {
	console.log (filename)
	const config = {
		headers: {
			"x-auth-token": tokenConfig(getState).headers['x-auth-token']
		},
		responseType: "blob"
	}
	axios
		.get(`/api/reports/fileview/${filename}`,config)
		.then(res => {
			dispatch({
				type: VIEW_REPORT,
				payload: res.data
			})
			var file = new Blob([res.data], {type: 'application/pdf'});
        	var fileURL = URL.createObjectURL(file);
			window.open(fileURL+"#toolbar=0");
		})
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const downloadReport = (filename) => (dispatch, getState) => {
	console.log (filename)
	const config = {
		headers: {
			"x-auth-token": tokenConfig(getState).headers['x-auth-token']
		},
		responseType: "blob"
	}
	axios
		.get(`/api/reports/filedownload/${filename}`,config)
		.then(res => {
			dispatch({
				type: DOWNLOAD_REPORT,
				payload: res.data
			})
			var file = new Blob([res.data], {type: 'application/pdf'});
			var fileURL = URL.createObjectURL(file);

			var link = document.createElement("a");
			link.setAttribute('download', '');
			link.href = fileURL;
			document.body.appendChild(link);
			link.click();
			link.remove();
		})
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