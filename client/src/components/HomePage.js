//To add a report
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import home_banner from '../images/home_banner.jpg'

class HomePage extends Component {
	render() {
		return (
			<div class="home-wrapper">
				{this.props.isAuthenticated?'':
					<div>
						<div class="home-banner">
							<img src={home_banner} alt="iiitb_banner" class="home"/>
							<div class="home-banner-text">
								<h3><b>Research Project Reports</b></h3>
								<h6>Ph.D | MS | M.Tech</h6>
							</div>
						</div>
							<Container>
								<div className="profile-body">
									<p> At IIITB, we follow the notion of research labs and centers which is an abstraction of a particular theme/area. A research lab encompasses people, projects, physical facilities, and activities. A research center or a center of excellence is an abstraction either in terms of the broader set of research themes being followed or in terms of hierarchy of research activities. </p>
									<p> Please login to view the Research Project Reports of the work we have done. </p>
									<div class="row">
										<div class="col-sm-4 col-md-4 col-lg-4 col-xs-12 sm-margin-bottom-20 animated">
										<ListGroup>
											<ListGroupItem active className="profile-header" tag="a" href="https://www.iiitb.ac.in/research-domains" target="_blank"><b>Research Profile</b></ListGroupItem>
											<ListGroupItem>Computer Science</ListGroupItem>
											<ListGroupItem>Data Sciences</ListGroupItem>
											<ListGroupItem>VLSI Systems</ListGroupItem>
											<ListGroupItem>Information Technology & Society</ListGroupItem>
											<ListGroupItem>Mathematics & Basic Sciences</ListGroupItem>
											<ListGroupItem>Networking Communications & Signal Processing</ListGroupItem>
											<ListGroupItem>Software Engineering</ListGroupItem>
										</ListGroup>
										</div>
										<div class="col-sm-4 col-md-4 col-lg-4 col-xs-12 sm-margin-bottom-20 animated">
										<ListGroup>
											<ListGroupItem active className="profile-header" tag="a" href="https://www.iiitb.ac.in/centers" target="_blank"><b>Research Centers</b></ListGroupItem>
											<ListGroupItem>Center For Information Technology And Public Policy</ListGroupItem>
											<ListGroupItem> E-Health Research Center</ListGroupItem>
											<ListGroupItem>Machine Intelligence And Robotics Center</ListGroupItem>
											<ListGroupItem>Cognitive Computing Centre of Excellence</ListGroupItem>
										</ListGroup>
										</div>
										</div>
									</div>
								
							</Container>
						</div >
				}
			</div>
		);
	}
}
const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, null)(HomePage);
