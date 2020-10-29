//To add an item
import React, { Component } from 'react';
import axios from 'axios';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
	NavLink,
	Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import Countdown from 'react-countdown';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify'; 

class RegisterModal extends Component {
	state = {
		modal: false,
		name: '',
		email: '',
		password: '',
		msg: null,
		otp: '',
		showMessage: false,
		confirmPassword: '',
		isEmailVerified: false,
		otpSend: false,
		isButtonDisabled: false,
		isButtonDisabledVerify: false
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		register: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired
	};

	constructor (props) {
		super(props);
		this.state.isButtonDisabled= false
	}

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== prevProps.error) {
			// Check for register error
			if (error.id === 'REGISTER_FAIL') {
				this.setState({ msg: error.msg.msg });
			} else {
				this.setState({ msg: null });
			}
		}

		// If Authenticated, close modal
		if (this.state.modal) {
			if (isAuthenticated) {
				this.toggle();
			}
		}
	}
	toggle = () => {
		// Clear errors
		this.props.clearErrors();
		this.setState({
			modal: !this.state.modal
		});
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
     
	confirmEmail = (event) => {
		event.preventDefault();
		const user = {
			email: this.state.email,
		}
		toast.configure() 
		if (this.state.email === "") {
			toast.warning("Enter the EmailID  to get an OTP 😶"); 
		}
		else if (this.state.name === "") {
			toast.warning("Enter the Name  to get an OTP 😶");
		}
		else if (/^[a-zA-Z0-9.]+@iiitb.org+$/.test(this.state.email) === false && 
		/^[a-zA-Z0-9.]+@iiitb.ac.in+$/.test(this.state.email) === false) {
			toast.error("Enter the Valid IIITB Id 😟");
		}
		else if(this.state.isEmailVerified){
			toast.warning("Email ID already verified!!  😕 ")
		}
		else {
			this.setState({ showMessage: true });
			this.setState({
				isButtonDisabled: true
			});	
			// **** here's the timeout ****
		setTimeout(() => this.setState({ isButtonDisabled: false }), 100000);
			axios.post('http://localhost:5000/api/otp/sendOTP/', user)
				.then(response => {
					toast.success("OTP Send.. Click verify OTP to proceed 🤩");
					this.state.otpSend = true
				})
				.catch(error => console.log(error));
		}
	}

	verifyEmail = () => {
        toast.configure() 
		const user = {
			otp: this.state.otp
		}
		if (!this.state.otpSend) {
			toast.warning("Send OTP First ! 😥")
		}
		else if (this.state.mail === "") {
			toast.warning("OTP Can't be generated without providing Email ID 😞 ")

		}
		else if (this.state.otp === "") {
			toast.warning("First enter OTP to validate 😕 ")

		}
		else if (this.state.otp.match(/^[0-9]/) === null) {
			toast.info("OTP can be only Numeric! 🤕")

		}
		else if (this.state.otp.length != 4) {
			toast.warning("OTP length should be only 4 😕 ")

		}
		else if(this.state.isEmailVerified){
			toast.warning("Email ID already verified!!  😎 ")
		}
		else {
			axios.post('http://localhost:5000/api/otp/verifyOTP/', user)
				.then(response => {
					this.setState({ showMessage: true });
			this.setState({
				isButtonDisabledVerify: true
			});	
			// **** here's the timeout ****
		setTimeout(() => this.setState({ isButtonDisabledVerify: false }), 1000000);
					toast.success("OTP Verified 🥳, Please Enter Password");
					this.state.isEmailVerified = true

					this.state.showMessage = false
				})
				.catch(error => {
					toast.error("WRONG OTP 😟. Please try Again!");

				});
		}
	}


	onSubmit = (e) => {
	
		toast.configure() 
		if (this.state.password !== this.state.confirmPassword) {
			toast.warning("Password Don't Match 😕 ")
		}
		else if(!this.state.isEmailVerified){
			toast.warning("Email ID Not verified 😕 ")
		}
		else  if(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(this.state.password)===false){
			toast.error("Weak Password! Minimum 8 characters,Max 20, Atleast 1 Uppercase, Lowercase,digit, special character 😟");
		}
		else {

			const { name, email, password } = this.state;
			// Create user object
			const newUser = {
				name, email, password
			};
			// Attempt to register
			this.props.register(newUser);
		}
	}
	render() {
		return (
			<div>
				<ToastsContainer hideProgressBar={true} position={ToastsContainerPosition.BOTTOM_LEFT} closeOnClick={true} store={ToastsStore} />
				<NavLink onClick={this.toggle} href="#">Register</NavLink>
				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Register</ModalHeader>
					<ModalBody>
						{this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for="name">Name</Label>
								<Input
									type="text"
									name="name" //should match the state name above
									id="name"
									placeholder="Name"
									className="mb-3"
									onChange={this.onChange}
								/>
								<Label for="email">Email</Label>
								<Input
									type="email"
									name="email" //should match the state name above
									id="email"
									placeholder="Email"
									className="mb-3"
									onChange={this.onChange}
								/>
						
								<div class="row">
									<div class="col">
										<Label for="password">Password</Label>
										<Input
											type="password"
											name="password" //should match the state name above
											id="password"
											placeholder="Password"
											className="mb-3"
											onChange={this.onChange}
										/>
									</div>
									<div class="col">
										<Label for="confirmPassword">Confirm Password</Label>
										<Input
											type="password"
											name="confirmPassword" //should match the state name above
											id="confirmPassword"
											placeholder="Please re-enter Password"
											className="mb-3"
											onChange={this.onChange}
										/>
									</div>
								</div>
								<div class="col-md-12 text-center">
									<button class="btn btn-primary" type="submit" >Register </button>
								</div>
								{this.state.showMessage && <p> Resend the OTP in </p>}
								{this.state.showMessage && <Countdown date={Date.now() + 60000} />}
							</FormGroup>
						</Form>
						<h3 > Email Verification</h3>
						<Label for="email">OTP</Label>
								<div class="row">
									<div class="col">
										<button class="btn btn-outline-primary" disabled={this.state.isButtonDisabled} onClick={this.confirmEmail} >Send OTP</button>
									</div>
									<div class="col">
										<Input
											name="otp" //should match the state name above
											id="otp"
											type="number"
											placeholder="Enter OTP"
											onChange={this.onChange}
										/>
									</div>
									<div class="col">
										<button class="btn btn-outline-primary" disabled={this.state.isButtonDisabledVerify}  onClick={this.verifyEmail} >Verify OTP</button>
									</div>
								</div>
								
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
});
export default connect(mapStateToProps, { register, clearErrors })(RegisterModal);