import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Table } from 'reactstrap';
import { CSSTransition, CSSTransitionGroup, TransitionGroup } from 'react-transition-group';
//import {v1 as uuid} from 'uuid'; ////import uuid from 'uuid/dist/v1';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';

import { getReports, deleteReport } from '../actions/ReportActions';
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
		isAuthenticated: PropTypes.bool,
		isAdmin: PropTypes.bool
	};

	componentDidMount() {
		this.props.getReports();
	}
	onDeleteClick = (id) => {
		this.props.deleteReport(id);
	}

	importAll = result => {
		let images = {};
		result.keys().map((item, index) => {
			return (images[item.replace("./", "")] = result(item));
		});
		return images;
	};

	render() {
		const { reports } = this.props.report;
		const webpackContext = require.context(
			"../../../uploads",
			false,
			/\.(pdf|PDF)$/
		);
		const files = this.importAll(webpackContext);
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
												{this.props.isAdmin ? <th></th> : ''}
												<th>Student Name</th>
												<th>Professor Name</th>
												<th>Category</th>
												<th>Semester</th>
												<th>Year</th>
												<th>Report</th>
											</tr>
										</thead>
										<tbody>
											{reports.length == 0 ? <th> No data to display </th> :
												reports.map(({ _id, studentName, semester, category, professorName, year, path }) => (
													<tr key={_id}>
														{this.props.isAdmin ?
															<th>
																<Button
																	title="Delete Report"
																	className="remove-btn"
																	color="danger"
																	size="sm"
																	onClick={this.onDeleteClick.bind(this, _id)}
																>&times;</Button>
															</th> : ''}
														<th>{studentName}</th>
														<th>{professorName}</th>
														<th>{category}</th>
														<th>{semester}</th>
														<th>{year}</th>
														<th><a href={files[`${path}`]} target="_blank">View File</a>&nbsp;&nbsp;&nbsp;&nbsp;
															<a href={files[`${path}`]} download title="Download">&darr;</a></th>
													</tr>
												))
											}
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
	isAuthenticated: state.auth.isAuthenticated,
	isAdmin: state.auth.isAdmin
});
export default connect(mapStateToProps, { getReports, deleteReport })(ReportsList);