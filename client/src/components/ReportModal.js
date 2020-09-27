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
class ReportModal extends Component {
	state = {
		modal: false,
		studentName: '',
		professorName: '',
		category: '',
		semester: '',
		year: ''
	};

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

	onSubmit = (e) => {
		e.preventDefault();
		const newReport = {
			studentName: this.state.studentName,
			professorName: this.state.professorName,
			category: this.state.category,
			semester: this.state.semester,
			year: this.state.year
		}

		// Add Report via addReport action
		this.props.addReport(newReport);

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
					<h4 classname="mb-3 ml-4">Please login to manage reports</h4>
				}

				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Add to Reports List</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.onSubmit}>
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
							<FormGroup>
								<Button
									color="dark"
									style={{ marginTop: '2rem' }}
									block
								>Add Report</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	report: state.report,
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { addReport })(ReportModal);