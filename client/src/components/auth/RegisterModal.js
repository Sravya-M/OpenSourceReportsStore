//To add an item

//Libraries
import React, { Component } from 'react';
import {
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
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; 
import { Facebook } from 'react-spinners-css';
import PasswordStrengthBar from 'react-password-strength-bar';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

//Local Imports
import { register, sendOTP, verifyOTP } from '../../actions/authActions';
import { confirmEmailAlright, verifyOTPEmailAlright, onRegisterAlright } from './utils/RegisterToasts';
import { clearErrors } from '../../actions/errorActions';


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
		isButtonDisabledVerify: false,
		passwordDisabled: true,
		emailDisabled: false,
		refresh:false
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		register: PropTypes.func.isRequired,
		sendOTP: PropTypes.func.isRequired,
		verifyOTP: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired
	};

	constructor (props) {
		super(props);
		this.state.isButtonDisabled= false
		this.state.passwordDisabled=true
		this.state.emailDisabled=false
		this.state = { time: {}, seconds: 59 };
		this.timer = 0;
		this.startTimer = this.startTimer.bind(this);
		this.countDown = this.countDown.bind(this);
	}

	secondsToTime(secs){
		let hours = Math.floor(secs / (60 * 60));
	
		let divisor_for_minutes = secs % (60 * 60);
		let minutes = Math.floor(divisor_for_minutes / 60);
	
		let divisor_for_seconds = divisor_for_minutes % 60;
		let seconds = Math.ceil(divisor_for_seconds);
	
		let obj = {
		  "h": hours,
		  "m": minutes,
		  "s": seconds
		};
		return obj;
	  }
	 
	  componentDidMount() {
		let timeLeftVar = this.secondsToTime(this.state.seconds);
		this.setState({ time: timeLeftVar });
		this.setState({passwordDisabled:true})
	  }
	
	  startTimer() {
		if (this.timer === 0 && this.state.seconds > 0) {
		  this.timer = setInterval(this.countDown, 1000);
		}
	  }
	
	  countDown() {
		// Remove one second, set state so a re-render happens.
		let seconds = this.state.seconds - 1;
		this.setState({
		  time: this.secondsToTime(seconds),
		  seconds: seconds,
		});
		
		// Check if we're at zero.
		if (seconds === 0) { 
		  clearInterval(this.timer);
		}
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

		if (confirmEmailAlright(this.state.email, this.state.name, this.state.isEmailVerified)) {
			this.setState({ showMessage: true, isButtonDisabled: true });
			// **** here's the timeout ****
			setTimeout(() => this.setState({ isButtonDisabled: false }), 60000);
			
			this.props.sendOTP(user)
				.then(response => {
					this.startTimer()
					toast.success("OTP Send.. Click verify OTP to proceed 🤩");
					this.setState({
						emailDisabled: true,
						otpSend: true
					});
				})
				.catch(error => console.log(error));
		}
	}

	verifyEmail = (e) => {
		e.preventDefault();
		const user = {
			otp: this.state.otp
		};
		if (verifyOTPEmailAlright (this.state.otp, this.state.otpSend, this.state.email, this.state.isEmailVerified)) {
			this.props.verifyOTP(user)
				.then(response => {
					this.setState({ showMessage: true, isButtonDisabledVerify: true });
					// **** here's the timeout ****
					setTimeout(() => this.setState({ isButtonDisabledVerify: false }), 60000);
					toast.success("OTP Verified 🥳, Please Enter Password");
					this.setState({
						isEmailVerified: true,
						passwordDisabled: false,
						showMessage: false
					});
					document.getElementById("notif").remove()
					this.setState({
						time: this.secondsToTime(0),
						seconds: 0,
					  });
				})
				.catch(error => {
					toast.error("WRONG OTP 😟. Please try Again!");

				});
		}
	}
	refresh=()=>{
		this.setState({
			refresh : true
		})

		document.getElementById("reload").innerHTML="<p><font color='2FA9C6'>Reloading, Hold On </fond></p>"
		document.getElementById("notif").remove()
		setTimeout(function(){
			//do what you need here
			window.location.reload()
		}, 2000);
	}

	renderElement(){
		if(this.state.otpSend === true)
		   return <p><font color="red" onClick={this.refresh}>Wanna Change Email ID?</font></p>;
		return null;
	 }
	 refreshRender(){
		 if(this.state.refresh === true)
		 return <Facebook color="#2FA9C6"/>;
		 return null;
	 }

	onregister = (e) => {
		e.preventDefault();
		if (onRegisterAlright(this.state.password, this.state.confirmPassword, this.state.isEmailVerified)) {
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
			<div >
				<ToastsContainer hideProgressBar={true} position={ToastsContainerPosition.BOTTOM_LEFT} closeOnClick={true} store={ToastsStore} />
				<NavLink onClick={this.toggle} href="#">Register</NavLink>
				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Register</ModalHeader>
					<ModalBody>
						{this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
						<Form >
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
								
								<Label  style={{ fontfamily : 'Arial, Helvetica, sans-serif' }} for="email">Email</Label>
								<Input
								    //style={{ text-shadow: '2px 2px' }}
									type="email"
									name="email" //should match the state name above
									id="email"
									placeholder="Email"
									className="mb-3"
									onChange={this.onChange}
									disabled={this.state.emailDisabled}
								/>
								<div id="reload"></div>
								<div>
									{ this.refreshRender() }
								</div>
								 <div>
                                  { this.renderElement() }
								  </div>
								 
								<div id="notif">
						        <h3 > Email Verification</h3>
								<div class="row">
									<div class="col">
										<button class="btn btn-outline-primary" disabled={this.state.isButtonDisabled} onClick={this.confirmEmail} >Send OTP</button>
									    <div>
										<p><font color="red">Resend OTP :  {this.state.time.s} </font></p> 
										</div>
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
										<button  class="btn btn-outline-primary" disabled={this.state.isButtonDisabledVerify}  onClick={this.verifyEmail} >Verify OTP</button>
									</div>
								</div>
						</div>

						
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
											disabled={this.state.passwordDisabled}
										/>
									</div>
									<div class="col">
										<Label for="confirmPassword">Confirm Password</Label>
										<Input
											type="password"
											name="confirmPassword" //should match the state name above
											id="confirmPassword"
											placeholder="Re-Enter Password"
											className="mb-3"
											onChange={this.onChange}
											disabled={this.state.passwordDisabled}
										/>
										
										
									</div>
									
								</div>
								<PasswordStrengthBar color="red" password={this.state.password} />
								<div class="col-md-12 text-center">
									<button class="btn btn-primary" onClick={this.onregister} >Register </button>
								</div>
							</FormGroup>
						</Form>
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
export default connect(mapStateToProps, { register, clearErrors, sendOTP, verifyOTP })(RegisterModal);