const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const REPORT = require('./../../models/Report');
const uploadReports = require('./uploadReports');
// @route 	GET api/reports
// @desc 	Get All Reports
// @access 	Public

router.get('/', (req, res) => {
	console.log ("reached")
	Report.find()
		.then(reports => res.json(reports));
});


// @route 	POST api/router
// @desc 	Create a report
// @access 	Private

router.post('/', auth, (req, res) => {
	uploadReports(req, res, err => {
		console.log("I got here ___");
		if (err) {
			console.log("Error ---- " + err);
		} else {
			console.log(req.body);
			console.log(req.body.tag);
			if (!req.file) {
				return res.status(404).send({ msg: "Report not found" });
			}
			var fullPath = req.file.filename;
			var report = {
				path: fullPath,
				studentName: req.body.studentName,
				tag: req.body.tag,
				category: req.body.category,
				professorName: req.body.professorName,
				year: req.body.year
			};
			var newReport = new REPORT(report);
			newReport.save(function (error, newGo) {
				if (error) {
					throw error;
				}
				res.status(200).send(newGo);
			});
		}
	});
});


// @route 	DELETE api/reports/:id
// @desc 	Delete a Report
// @access 	Private

router.delete('/:id', auth, (req, res) => {

	Report.findById(req.params.id)
		.then(report => report.remove().then(() => res.json({ sucess: true })))
		.catch(err => res.status(404).json({ sucess: false }));
});

module.exports = router;