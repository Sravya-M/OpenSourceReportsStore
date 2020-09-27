const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Bring in the report model
const Report = require('../../models/Report');

// @route 	GET api/reports
// @desc 	Get All Reports
// @access 	Public

router.get('/', (req, res) => {
	Report.find()
		.then(reports => res.json(reports));
});


// @route 	POST api/router
// @desc 	Create a report
// @access 	Private

router.post('/', (req, res) => {
	const { studentName, semester, category, professorName, year } = req.body;
	console.log(studentName + "\n" + semester + "\n" + category + "\n" + professorName + "\n" + year);
	if (!studentName || !semester || !category || !professorName || !year) {

		return res.status(400).json({ msg: 'Please enter all the details' });
	}

	const newReport = new Report({
		studentName,
		semester,
		category,
		professorName,
		year
	});

	newReport.save()
		.then(report => res.json(report));
});


// @route 	DELETE api/reports/:id
// @desc 	Delete a Report
// @access 	Private

router.delete('/:id', (req, res) => {
	Report.findById(req.params.id)
		.then(report => report.remove().then(() => res.json({ sucess: true })))
		.catch(err => res.status(404).json({ sucess: false }));
});

module.exports = router;