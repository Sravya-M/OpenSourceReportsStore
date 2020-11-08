//To add a report
import React, { Component } from 'react';
import { connect } from 'react-redux';
import home_banner from '../images/home_banner.jpg'

class HomePage extends Component {
	render() {
		return (
			<div>
				{this.props.isAuthenticated?'':
						<div class="home-banner">
							<img src={home_banner} alt="iiitb_banner" class="home"/>
							<div class="home-banner-text">
								<h3><b>Research Reports</b></h3>
								<h4><b>IIITB</b></h4>
							</div>
						</div>
				}
			</div >
		);
	}
}
const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, null)(HomePage);