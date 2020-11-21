//To add a report
import React, { Component } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import { addReport } from '../actions/ReportActions';
class ReportModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			studentName: '',
			professorName: '',
			category: '',
			year: '',
			selectedFile: null,
			tag: []
		      
		};
	}
	 removeTag = (i) => {
 	   const newTags = [ ...this.state.tag ];
    	newTags.splice(i, 1);
    	this.setState({ tag: newTags });
  	}
  	inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === 'Tab' && val) {
      /*if (this.state.tag.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }*/
      this.setState({ tag: [...this.state.tag, val]});
      this.tagInput.value = null;
    } else if (e.key === 'Backspace' && !val) {
      this.removeTag(this.state.tag.length - 1);
    }
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
			tag: this.state.tag,
			year: this.state.year,
			selectedFile: e.target.files[0]
		});
	}
	handleUpload = (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		data.append("file", this.state.selectedFile);
		data.append("tag", this.state.tag)
		this.props.addReport(data);
		console.log(this.state.tag);
		this.setState({tag: []});
		
		//Close modal
		this.toggle();
	}
	render() {
		const { tag } = this.state;
		return (
			<div>
				{this.props.isAuthenticated && this.props.isAdmin ?
					<Button
						color="dark" title="Add Report"
						onClick={this.toggle}
					><b><AddIcon/></b></Button>
					:
					''
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
									<select id="category" name="category" class="form-control">
										<option value="MTech Thesis">MTech Thesis</option>
										<option value="iMTech Thesis">iMTech Thesis</option>
										<option value="PhD Thesis">PhD Thesis</option>
										<option value="Other">Other</option>
									</select>
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
							</div><br/>
							<div class="col">
								<input
									type="file"
									name=""
									id=""
									onChange={this.handleSelectedFile}
									required
								/>
							<label for="file" style={{color:"red"}}>* only pdf less than 2MB</label>
							</div><br/>
							<div class="col">

									<label htmlFor="tags">Tags: (press TAB after each tag)</label>
									 <div className="input-tag">
								        <ul className="input-tag__tags">
								          { tag.map((tag, i) => (
								            <li key={tag}>
								              {tag}
								              <button type="button" onClick={() => { this.removeTag(i); }}>+</button>
								            </li>
								          ))}
								          <li className="input-tag__tags__input"><input type="text" class="form-control" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>

								        </ul>
								      </div>
								</div><br/>
								<div class="col-md-12 text-center">
									<button class="btn btn-primary" type="submit" > Upload </button>
								</div>
						</form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	report: state.report,
	isAdmin: state.auth.isAdmin,
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { addReport })(ReportModal);