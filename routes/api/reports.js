const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const REPORT = require('./../../models/Report');
const uploadReports = require('./uploadReports');
const logger = require('../../logs_config/winston');

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

	const activityId = req.header('x-auth-token').split('.')[2];
	const userId=req.user.id;
	//const userType = (req.user.role == "admin")?"Admin":((req.user.email).includes("@iiitb")?"Insider":"Outsider");

	uploadReports(req, res, err => {
		console.log("I got here ___");
		if (err) {
			logger.error('Adding Report Failed',{'userId':userId,'activityId':activityId,'context':'report.js'});
			//console.log("Error ---- " + err);
		} else {
			console.log(req.body);
			console.log(req.body.tag);
			if (!req.file) {
				logger.error('Adding Report-Report not found',{'userId':userId,'activityId':activityId,'context':'report.js'});
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
					logger.error('Adding Report',{'userId':userId,'activityId':activityId,'context':'report.js'});
					throw error;
				}
				logger.info('Added Report',{'userId':userId,'activityId':activityId,'context':'report.js'});
				res.status(200).send(newGo);
			});
		}
	});
});


// @route 	DELETE api/reports/:id
// @desc 	Delete a Report
// @access 	Private

router.delete('/:id', auth, (req, res) => {

	const activityId = req.header('x-auth-token').split('.')[2];
	const userId=req.user.id;
	//const userType = (req.user.role == "admin")?"Admin":((req.user.email).includes("@iiitb")?"Insider":"Outsider");

	Report.findById(req.params.id)
		.then(report => {
			const filename=report.path;
			report.remove().then(() => {
				
			res.json({ sucess: true })
			logger.info('Deleted Report - '+req.params.id,{'userId':userId,'activityId':activityId,'context':'report.js'});
		})
	})
		.catch(err => {
			logger.error('Deleting Report-Report not found - '+req.params.id,{'userId':userId,'activityId':activityId,'context':'report.js'});
			res.status(404).json({ sucess: false })});
});

module.exports = router;