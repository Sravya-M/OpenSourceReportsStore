import { GET_ERRORS, CLEAR_ERRORS } from "./types";

// Return errors
export const returnErrors = (msg, status, id = null) => {
	return {
		type: GET_ERRORS,
		payload: { msg, status, id }
	};
};

// Clear errors
export const errorsErrors = () => {
	return {
		type: CLEAR_ERRORS
	};
};