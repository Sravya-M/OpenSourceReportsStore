import React, { Component } from 'react';
import {
	Navbar,
	Nav,
	Container
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../images/iiitb_footer.png'

class AppFooter extends Component {
	state = {
		isOpen: false
	}

	static propTypes = {
		auth: PropTypes.object.isRequired
	}
	

	render() {
		let fullYear = new Date().getFullYear();
		return (
			<Navbar fixed="bottom" className="footer">
				<Container>
					<a href="/"><img src={logo} class="footerlogo" alt=""/> </a>
					<Nav lg={12} color="light">
						<div>{fullYear}-{fullYear+1}, Rights reserved by XXX</div>
					</Nav>
				</Container>
			</Navbar>
		);

	}
}

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps, null)(AppFooter);