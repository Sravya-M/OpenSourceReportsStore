// Actual state is going go here
// Check actions here (getItemAction, addItemAction)
import { GET_REPORTS, ADD_REPORT, DELETE_REPORT, REPORTS_LOADING , VIEW_REPORT, DOWNLOAD_REPORT} from '../actions/types';

const initialState = {
	reports: [],
	file: null,
	loading: false
}

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_REPORTS:
			return {
				...state,
				reports: action.payload,
				loading: false
			};
		case DELETE_REPORT:
			return {
				...state,
				reports: state.reports.filter(report => report._id !== action.payload)
			};
		case ADD_REPORT:
			return {
				...state,
				reports: [action.payload, ...state.reports]
			};
		case REPORTS_LOADING:
			return {
				...state,
				loading: true
			};
		case VIEW_REPORT:
			return {
				...state,
				file: action.payload
			};
		case DOWNLOAD_REPORT:
			return {
				...state,
				file: action.payload
			};
		default:
			return state;
	}
}