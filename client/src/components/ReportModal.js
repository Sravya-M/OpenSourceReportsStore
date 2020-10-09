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
		isAuthenticated: PropTypes.bool
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
				{this.props.isAuthenticated ?
					<Button
						color="dark"
						style={{ marginBottom: '2rem' }}
						onClick={this.toggle}
					>Add Report</Button>
					:
					<div>
						<h1 classname="mb-3 ml-4">Open Source Reports Management</h1>
						<br />
						<h4 classname="mb-3 ml-4">Please login to manage reports</h4>
					</div>
				}

				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Add to Reports List</ModalHeader>
					<ModalBody>
						{/* <Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for="studentName">Student Name</Label>
								<Input
									type="text"
									name="studentName" //should match the state name above
									id="studentName"
									placeholder="Add Student name"
									onChange={this.onChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="professorName">Professor Name</Label>
								<Input
									type="text"
									name="professorName" //should match the state name above
									id="professorName"
									placeholder="Add Professor name"
									onChange={this.onChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="category">Category</Label>
								<Input type="select" name="category" id="category" onChange={this.onChange}>
									<option>Select</option>
									<option>RE Report</option>
									<option>Thesis Report</option>
									<option>PhD Report</option>
								</Input>
							</FormGroup>
							<FormGroup>
								<Label for="semester">Semester</Label>
								<Input
									type="number"
									name="semester"
									id="semester"
									placeholder="Enter semester number"
									onChange={this.onChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="year">Year</Label>
								<Input type="select" name="year" id="year" onChange={this.onChange}>
									<option>Select</option>
									<option>2019</option>
									<option>2020</option>
								</Input>
							</FormGroup>
							<div className="form-group">
								<input
									type="file"
									name=""
									id=""
									onChange={this.onChangeFile}
								/>
							</div>
							<FormGroup>
								<Button
									color="dark"
									style={{ marginTop: '2rem' }}
									block
								>Add Report</Button>
							</FormGroup>
						</Form> */}
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
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { addReport })(ReportModal);