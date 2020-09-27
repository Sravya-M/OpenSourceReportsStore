const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema

const ReportSchema = new Schema({
	studentName: {
		type: String,
		required: true,
	},
	semester: {
		type: Number,
		required: true
	},
	category: {
		type: String,
		isRequired: true
	},
	professorName: {
		type: String,
		isRequired: true
	},
	year: {
		type: Number,
		isRequired: true
	}
});

module.exports = Report = mongoose.model('report', ReportSchema);