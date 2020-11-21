const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../../middleware/auth');
const REPORT = require('./../../models/Report');
const uploadReports = require('./uploadReports');
const logger = require('../../logs_config/winston');
const fs = require('fs');

// for logging
function loginfo(req,level, message) {
	const logs = {
		userId : req.user.id,
		userType : (req.user.role == "admin")?"Admin":((req.user.email).includes("@iiitb")?"Insider":"Outsider"),
		activityId : req.header('x-auth-token').split('.')[2],
		name : req.user.name,
		email : req.user.email,
	}
	logger.log(level,message,{'userId':logs.userId,'activityId':logs.activityId,'context':'report.js','userType':logs.userType,'name':logs.name,'email':logs.email});

}

// @route 	GET api/reports
// @desc 	Get All Reports
// @access 	Public

router.get('/', (req, res) => {
	console.log ("reached")
	Report.find()
		.then(reports => res.json(reports));
});

// @route 	GET api/reports/fileview/filename
// @desc 	View a file
// @access 	Private

router.get('/fileview/:file(*)', auth, (req, res) => {

	var fileLocation = path.join(__dirname,'../../uploads',req.params.file);

	res.sendFile(fileLocation, err => {
		if(err){
			loginfo(req,'error','View Report - file not found '+req.params.file);
			return res.status(404).send({ msg: "Report not found" });
		}
		else
			loginfo(req,'info','View Report '+req.params.file);
	});
});

// @route 	GET api/reports/filedownload/filename
// @desc 	Download a file
// @access 	Private

router.get('/filedownload/:file(*)', auth, (req, res) => {
	
	var fileLocation = path.join(__dirname,'../../uploads',req.params.file);

	res.download(fileLocation, req.params.file, err => {
		if(err){
			loginfo(req,'error','Download Report - file not found '+req.params.file);
			return res.status(404).send({ msg: "Report not found" });
		}
		else
			loginfo(req,'info','Download Report '+req.params.file);
	});
});

// @route 	POST api/router
// @desc 	Create a report
// @access 	Private

router.post('/', auth, (req, res) => {

	uploadReports(req, res, err => {
		console.log("I got here ___");
		if (err) {
			loginfo(req, 'error', 'Adding Report Failed');
		} else {
			console.log(req.body);
			console.log(req.body.tag);
			if (!req.file) {
				loginfo(req, 'error', 'Adding Report-Report not found');
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
					loginfo(req, 'error', 'Adding Report failed - meet the requirements');
				}
				loginfo(req, 'info', 'Added Report');
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
		.then(report => {
			const filename=report.path;
			report.remove().then(() => {
			fs.unlink('uploads/'+filename,err => {if(err) loginfo(req,'error','Delete Report - file unavailable');});					// physical unlinking of the file on disk
			res.json({ sucess: true })
			loginfo(req, 'info', 'Deleted Report - '+req.params.id);
		})
	})
		.catch(err => {
			loginfo(req, 'error', 'Deleting Report-Report not found - '+req.params.id);
			res.status(404).json({ sucess: false })});
});

module.exports = router;