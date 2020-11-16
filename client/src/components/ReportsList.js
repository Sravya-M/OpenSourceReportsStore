import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Table, Input , Container} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Pagination from './Pagination';

import { getReports, deleteReport } from '../actions/ReportActions';
import ReportModal from './ReportModal';
class ReportsList extends Component {

	constructor() {
		super();

		this.state = {
			search: [],
			currentPage: 1,
			postsPerPage: 5
		};
	}

	onChange = (e) => {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	// displaying tags STARTS
	removeTag = (i) => {
		const newTags = [...this.state.search];
		newTags.splice(i, 1);
		this.setState({ search: newTags });
	}

	// displaying tags ENDS
	searchSpace = (event) => {
		//alert ("welcome")
		//	event.preventDefault()
		let keyword = event.target.innerText;
		if (this.state.search.indexOf(keyword) <= -1) {
			this.setState({ search: [...this.state.search, keyword] })
			console.log(keyword)
		}
	}

	static propTypes = {
		getReports: PropTypes.func.isRequired,
		report: PropTypes.object.isRequired,
		isAuthenticated: PropTypes.bool,
		isAdmin: PropTypes.bool
	};

	componentDidMount() {
		this.props.getReports();
		//console.log (this.props.tag)
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

	pagination = (searchReports) => {

		// when there is an empty result in a page, restart from 1st page
		if (Math.ceil(searchReports.length / this.state.postsPerPage) < this.state.currentPage && this.state.currentPage !== 1)
			this.setState({ currentPage: 1 })

		// Change page
		const paginate = pageNumber => this.setState({ currentPage: pageNumber });
		return (
			<div class="nav-page" expand="sm">
				<div class="numberofpages">
					<select size="sm" class="form-control" name="postsPerPage"
						value={this.state.postsPerPage} onChange={this.onChange} title="rows per page">
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
					</select>
				</div>
				<div class="entriesPerPage">entries/page</div>
				<Pagination
					postsPerPage={this.state.postsPerPage}
					totalPosts={searchReports.length}
					paginate={paginate}
					currentPage={this.state.currentPage}
				/>
			</div>
		);
	}

	display = searchReports => {

		//console.log(searchReports);
		const webpackContext = require.context(
			"../../../uploads",
			false,
			/\.(pdf|PDF)$/
		);
		const files = this.importAll(webpackContext);

		const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
		const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
		const currentPosts = searchReports.slice(indexOfFirstPost, indexOfLastPost);

		return (
			<div class="report-list">
				{this.pagination(searchReports)}
				<Table class="table">
					<thead>
						<tr>
							{this.props.isAdmin ? <th></th> : ''}
							<th role="button">Student Name</th>
							<th>Professor Name</th>
							<th>Category</th>
							<th>Tags</th>
							<th>Report</th>
						</tr>
					</thead>
					{
						currentPosts.map(({ _id, studentName, tag, category, professorName, year, path }) => (

							<tr key={_id}>
								{this.props.isAdmin ?
									<td>
										<Button
											title="Delete Report"
											className="remove-btn"
											color="danger"
											size="sm"
											onClick={this.onDeleteClick.bind(this, _id)}
										>&times;</Button>
									</td> : ''}
								<td>{studentName}</td>
								<td>{professorName}</td>
								<td>{category}</td>

								<td>
									<ul className="input-tag__tags">
										{tag[0].split(",").map((val) => <button onClick={this.searchSpace.bind(this)} class="table-tags"> {val} </button>)}
									</ul>
								</td>
								<td><a href={files[`${path}`]} target="_blank" rel="noopener noreferrer">View</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<a href={files[`${path}`]} download title="Download">&darr;</a></td>
							</tr>

						))
					}
				</Table>
				{this.pagination(searchReports)}
			</div>
		);

	}

	filter = reports => {
		//console.log(this.state.search);
		const searchReports = reports.filter((data) => {
			//console.log (data)
			if (this.state.search === [])
				return data;
			else {
				for (let i = 0; i < this.state.search.length; i++)
					if (data.tag[0].toLowerCase().split(",").indexOf(this.state.search[i].toLowerCase()) <= -1)
						return null;
				return data;

			}
		})

		return this.display(searchReports);
	}

	handleEnter = (e) => {
		if (e.key === 'Enter' && e.target.value) {
			//console.log (e.target.value);
			let keyword = e.target.value;
			if (this.state.search.indexOf(keyword) <= -1) {
				this.setState({ search: [...this.state.search, keyword] })
				console.log(keyword)
				e.target.value = ""
			}
		}
	}

	render() {
		const { reports } = this.props.report;

		return (
			<center>
				{this.props.isAuthenticated ?
					<div class="wrapper">
					<Container>
					<div class="content" expand="sm">
						<ListGroup>
							<TransitionGroup className="reports-list" width="100%">
								<CSSTransition timeout={500} classNames="fade">
									<ListGroupItem>
										<div class="search-bar">
											<div className="searchForm">
												<ReportModal />
												<div className="ml-auto"><Input
													type="text"
													placeholder="Search ..."
													onKeyDown={this.handleEnter}
												/></div>
											</div>
											<div className="input-tag">
												<ul className="input-tag__tags">
													{this.state.search.map((tag, i) => (
														<li key={tag}>
															{tag}
															<button type="button" onClick={() => { this.removeTag(i); }}>+</button>
														</li>
													))}
												</ul>
											</div>

										</div>
										<div>
											{reports.length === 0 ? <th> No data to display </th> :
												this.filter(reports)
											}
										</div>
									</ListGroupItem>

								</CSSTransition>
							</TransitionGroup>
						</ListGroup>
					</div>
					</Container>
					</div>
					: null}
			</center>
		);
	}
}

const mapStateToProps = (state) => ({
	report: state.report,
	isAuthenticated: state.auth.isAuthenticated,
	isAdmin: state.auth.isAdmin
});
export default connect(mapStateToProps, { getReports, deleteReport })(ReportsList);
