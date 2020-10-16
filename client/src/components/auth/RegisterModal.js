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
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import Countdown from 'react-countdown';

class RegisterModal extends Component {
	state = {
		modal: false,
		name: '',
		email: '',
		password: '',
		msg: null,
		otp:'',
		showMessage: false,
		confirmPassword: '',
		isEmailVerified: false,
		otpSend:false
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		register: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired
	};

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

	confirmEmail =()=>{
		const user = {
			email: this.state.email,
		}
		console.log(user);
		if(this.state.email==="" ){
			ToastsStore.warning("Enter the EmailID  to get an OTP 😶");
		}
		else if(this.state.name===""){
			ToastsStore.warning("Enter the Name  to get an OTP 😶");
		}
		else if(/^[a-zA-Z0-9.]+@iiitb.org+$/.test(this.state.email)===false){
			ToastsStore.error("Enter the Valid IIITB Id 😟");
		}
		else{	
		this.setState({showMessage: true});	
		axios.post('http://localhost:5000/sendOTP/', user)
		.then(response => {
			ToastsStore.success("OTP Send.. Click verify OTP to proceed 🤩");
			this.state.otpSend=true
		})
		.catch(error => console.log(error));
	}
	}

	verifyEmail =()=>{
			
		const user = {
		    otp: this.state.otp
		}	
	    if(!this.state.otpSend){
			ToastsStore.warning("Send OTP First ! 😕 ")
		}
		else if(this.state.mail===""){
			ToastsStore.warning("OTP Can't be generated without providing Email ID😕 ")

		}
		else if (this.state.otp===""){
			ToastsStore.warning("First enter OTP to validate 😕 ")
			
		}
		else if(this.state.otp.match(/^[0-9]/) === null){
			ToastsStore.info("OTP can be only Numeric! 🤕")
			
		}
		else if(this.state.otp.length != 4){
			ToastsStore.warning("OTP length should be only 4 😕 ")
			
		}
		else{
		axios.post('http://localhost:5000/verifyOTP/', user)
		.then(response => {
				ToastsStore.success("OTP Verified 🥳, Please Enter Password");
				this.state.isEmailVerified=true
				this.state.showMessage=false
		})
		.catch(error => {
			ToastsStore.error("WRONG OTP 😟. Please try Again!");
		
		});
	}
	}
	

	onSubmit = (e) => {
		e.preventDefault();
		if (this.state.password !== this.state.confirmPassword) {
			ToastsStore.warning("Password Don't Match 😕 ")
		} 
		//else if(!this.state.isEmailVerified){
		//	ToastsStore.warning("Email ID Not verified 😕 ")
		//}
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
				<ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} closeOnClick={true} store={ToastsStore}/>
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
								<Label for="otp">OTP</Label>
								<Input
									
									name="otp" //should match the state name above
									id="otp"
									placeholder="Enter OTP "
									className="mb-3"
									onChange={this.onChange}
								/>
								<Label for="password">Password</Label>
								<Input
									type="password"
									name="password" //should match the state name above
									id="password"
									placeholder="Password"
									className="mb-3"
									onChange={this.onChange}
								/>
								<Label for="confirmPassword">confirmPassword</Label>
								<Input
									type="password"
									name="confirmPassword" //should match the state name above
									id="confirmPassword"
									placeholder="confirmPassword"
									className="mb-3"
									onChange={this.onChange}
								/>
								  <div class="col-md-12 text-center">
								<button class="btn btn-outline-primary" type="submit" >Register </button>
								</div>
								<br></br>
								<div class="second">
                         <div class="col-md-12 text-center">
                      <form>
             
				&nbsp; &nbsp;&nbsp;
                <button class="btn btn-outline-primary" onClick={this.confirmEmail} >Send OTP </button>
				&nbsp;&nbsp;&nbsp;
				<button class="btn btn-outline-primary" onClick={this.verifyEmail}  >Verify OTP </button>
            </form>
      </div>
</div>
{this.state.showMessage && <p> Resend the OTP in </p>}
{this.state.showMessage && <Countdown date={Date.now() + 30000} />}

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
export default connect(mapStateToProps, { register, clearErrors })(RegisterModal);