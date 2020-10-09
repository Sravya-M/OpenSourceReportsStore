const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema

const ReportSchema = new Schema({
	studentName: {
		type: String
	},
	semester: {
		type: Number,
		default: 1
	},
	category: {
		type: String
	},
	professorName: {
		type: String
	},
	year: {
		type: Number,
		default: 2000
	},
	path: {
		type: String,
		isRequired: true
	}
}, {
	timestamps: true
});
module.exports = Report = mongoose.model('Report', ReportSchema);