import {toast} from 'react-toastify';

export const confirmEmailAlright = (email, name, isEmailVerified) => {
	toast.configure();

	let alright = false;
	if (!email || email === "") {
		toast.warning("Enter the EmailID  to get an OTP 😶"); 
	} else if (!name || name === "") {
		toast.warning("Enter the Name  to get an OTP 😶");
	} else if (/^[a-zA-Z0-9.]+@iiitb.org+$/.test(email) === false && 
	/^[a-zA-Z0-9.]+@iiitb.ac.in+$/.test(email) === false) {
		toast.error("Enter the Valid IIITB Id 😟");
	} else if(isEmailVerified){
		toast.warning("Email ID already verified!!  😕 ");
	} else {
		alright = true;
	}

	return alright;
}

export const verifyOTPEmailAlright = (otp, otpSend, email, isEmailVerified) => {
	toast.configure();

	let alright = false;
	if (!otpSend) {
		toast.warning("Send OTP First ! 😥");
	} else if (!email || email === "") {
		toast.warning("OTP Can't be generated without providing Email ID 😞 ");
	} else if (!otp || otp === "") {
		toast.warning("First enter OTP to validate 😕 ");
	} else if (otp.match(/^[0-9]/) === null) {
		toast.info("OTP can be only Numeric! 🤕");
	} else if (otp.length != 4) {
		toast.warning("OTP length should be only 4 😕 ");
	} else if(isEmailVerified){
		toast.warning("Email ID already verified!!  😎 ");
	} else {
		alright = true;
	}
	return alright;
}

export const onRegisterAlright = (password, confirmPassword, isEmailVerified) => {
	toast.configure();

	let alright = false;
	if (!password || password.length == 0 || password === " ") {
		toast.error("Password can't be Empty 😕 ");
	} else if (!confirmPassword || confirmPassword == "" || confirmPassword == " ") {
		toast.warning("Enter confirm password, same as password");
	} else if (password !== confirmPassword) {
		toast.warning("Password Don't Match 😕 ");
	} else if(!isEmailVerified){
		toast.warning("Email ID Not verified 😕 ");
	} else  if(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(password)===false){
		toast.error("Weak Password! Minimum 8 characters,Max 20, Atleast 1 Uppercase, Lowercase,digit, special character 😟");
	} else {
		alright = true;
	}
	return alright;
}