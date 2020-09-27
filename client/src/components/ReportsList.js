import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Table } from 'reactstrap';
import { CSSTransition, CSSTransitionGroup, TransitionGroup } from 'react-transition-group';
//import {v1 as uuid} from 'uuid'; ////import uuid from 'uuid/dist/v1';
import { connect } from 'react-redux';
import { getReports, deleteReport } from '../actions/ReportActions';
import PropTypes from 'prop-types';
class ReportsList extends Component {
	// state = {
	// 	items: [
	// 		{id: uuid(), name: 'Milk'},
	// 		{id: uuid(), name: 'Curd'},
	// 		{id: uuid(), name: 'Bread'},
	// 		{id: uuid(), name: 'Veggies'}
	// 	]
	// } // Moved to reducer

	static propTypes = {
		getReports: PropTypes.func.isRequired,
		report: PropTypes.object.isRequired,
		isAuthenticated: PropTypes.bool
	};

	componentDidMount() {
		this.props.getReports();
	}
	onDeleteClick = (id) => {
		this.props.deleteReport(id);
	}
	render() {

		const { reports } = this.props.report;
		return (

			<Container>
				{this.props.isAuthenticated ?
					<ListGroup>
						<TransitionGroup className="reports-list">
							<CSSTransition timeout={500} classNames="fade">

								<ListGroupItem>
									<Table>
										<thead>
											<tr>
												<th>Student Name</th>
												<th>Professor Name</th>
												<th>Category</th>
												<th>Semester</th>
												<th>Year</th>
											</tr>
										</thead>
										<tbody>
											{reports.map(({ _id, studentName, semester, category, professorName, year }) => (
												<tr key={_id}>
													<th>{studentName}</th>
													<th>{professorName}</th>
													<th>{category}</th>
													<th>{semester}</th>
													<th>{year}</th>
												</tr>
											))}
										</tbody>
									</Table>
								</ListGroupItem>

							</CSSTransition>
						</TransitionGroup>
					</ListGroup>
					: null}
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	report: state.report,
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { getReports, deleteReport })(ReportsList);