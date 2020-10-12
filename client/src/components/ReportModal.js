//To add a report
import React, { Component } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addReport } from '../actions/ReportActions';
import axios from 'axios';
class ReportModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			studentName: '',
			professorName: '',
			category: '',
			semester: '',
			year: '',
			selectedFile: null
		};
	}

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		isAdmin: PropTypes.bool
	};

	toggle = () => {
		this.setState({
			modal: !this.state.modal
		});
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSelectedFile = (e) => {
		e.preventDefault();
		this.setState({
			studentName: this.state.studentName,
			professorName: this.state.professorName,
			category: this.state.category,
			semester: this.state.semester,
			year: this.state.year,
			selectedFile: e.target.files[0]
		});
	}
	handleUpload = (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		data.append("file", this.state.selectedFile);
		this.props.addReport(data);

		//Close modal
		this.toggle();
	}
	render() {
		return (
			<div>
				{this.props.isAuthenticated && this.props.isAdmin ?
					<Button
						color="dark"
						style={{ marginBottom: '2rem' }}
						onClick={this.toggle}
					>Add Report</Button>
					:
					this.props.isAuthenticated ?
						''
						:
						<div>
							<h1 className="mb-3 ml-4">Open Source Reports Management</h1>
							<br />
							<h4 className="mb-3 ml-4">Please login to manage reports</h4>
							<br />
						</div>
				}

				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Add to Reports List</ModalHeader>
					<ModalBody>
						<form onSubmit={this.handleUpload}>
							<div class="row">
								<div class="col">
									<label htmlFor="studentName">Student Name:</label>
									<input
										type="text"
										class="form-control"
										name="studentName"
										onChange={this.onChange}
										placeholder="Student Name"
									/>
								</div>
								<div class="col">
									<label htmlFor="professorName">Professor Name:</label>
									<input
										type="text"
										class="form-control"
										name="professorName"
										onChange={this.onChange}
										placeholder="Professor Name"
									/>
								</div>
							</div>
							<div class="row">
								<div class="col">
									<label for="category">Choose category:</label>
									<select id="category" name="category">
										<option value="MTech Thesis">MTech Thesis</option>
										<option value="iMTech Thesis">iMTech Thesis</option>
										<option value="PhD Thesis">PhD Thesis</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div class="col">
									<label htmlFor="semester">Semester:</label>
									<input
										type="number"
										min="1"
										max="10"
										class="form-control"
										name="semester"
										onChange={this.onChange}
										placeholder="Semester"
									/>
								</div>
								<div class="col">
									<label htmlFor="year">Year:</label>
									<input
										type="number"
										min="2000"
										max="2020"
										class="form-control"
										name="year"
										onChange={this.onChange}
										placeholder="Year"
									/>
								</div>
							</div>
							<div className="form-group">
								<input
									type="file"
									name=""
									id=""
									onChange={this.handleSelectedFile}
								/>
							</div>
							<button type="submit" class="btn btn-primary">
								Upload
							</button>
						</form>
					</ModalBody>
				</Modal>
			</div >
		);
	}
}
const mapStateToProps = state => ({
	report: state.report,
	isAdmin: state.auth.isAdmin,
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { addReport })(ReportModal);