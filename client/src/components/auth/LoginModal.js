//To add an item
import React, { Component } from 'react';
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
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class LoginModal extends Component {
	state = {
		modal: false,
		email: '',
		password: '',
		role: '',
		adminKey: '',
		msg: null
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		login: PropTypes.func.isRequired,
		isAdmin: PropTypes.bool.isRequired,
		clearErrors: PropTypes.func.isRequired
	};

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated, isAdmin } = this.props;
		if (error !== prevProps.error) {
			// Check for login error
			if (error.id === 'LOGIN_FAIL') {
				this.setState({ msg: error.msg.msg });
			} else {
				this.setState({ msg: null });
			}
		}
//		debugger;
		// If Authenticated, close modal
		if (this.state.modal) {
			if (isAuthenticated && !isAdmin) {
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

	onSubmit = (e) => {
		e.preventDefault();
		const { email, password, adminKey } = this.state;
		const user = {
			email,
			password,
			adminKey
		}
//		debugger;
		//Attempt to login
		this.props.login(user).then(res => {
			//debugger;
			//this.setState({ role: res.payload.user.role });
		});
	}

	adminSubmit = () => {
		debugger;
		console.log("I am in adminSubmit");

	}

	render() {
		return (
			<div>
				<NavLink onClick={this.toggle} href="#">Login</NavLink>

				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Login</ModalHeader>
					<ModalBody>
						{this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for="email">Email</Label>
								<Input
									type="email"
									name="email" //should match the state name above
									id="email"
									placeholder="Email"
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

								<div class="row">
									<div class="col-md-12 text-center">
										<button class="btn btn-primary" type="submit" >Login </button>
									</div>
									
									

									{/* AdminKey logic to be added here

									{(this.state.role == 'admin') ? (
										<div class="col">
											<Label for="adminKey">Admin Key</Label>
											<Input
												type="password"
												name="adminKey" //should match the state name above
												id="adminKey"
												placeholder="Enter Admin key, If you are a student, Ignore this"
												className="mb-3"
												onChange={this.onChange}
											/>
											<Button
												color="dark"
												style={{ marginTop: '2rem' }}
												onClick={this.adminSubmit}
												block
											>Admin Login</Button>
										</div>
									) : ''} */}
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
	isAdmin: state.auth.isAdmin,
	error: state.error
});
export default connect(mapStateToProps, { login, clearErrors })(LoginModal);