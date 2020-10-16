const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');

// SEND OTP
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'iiitbemailverify@gmail.com',
		pass: 'admin123ssss'
	}
});

// Access the parse results as request.body
function generateOTP() {

	// Declare a digits variable  
	// which stores all digits 
	var digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}


router.post('/sendOTP', (request, response) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	var otp = generateOTP()
	MongoClient.connect(url, (err, db) => {
		if (err) throw err;
		var dbo = db.db("check");
		var myobj = { "createdAt": new Date(), "otp": otp };
		dbo.collection("temp2").insertOne(myobj, function (err, res) {
			if (err) throw err;
			console.log("1 document inserted");
		});
	});
	var mailOptions = {
		from: 'iiitbemailverify@gmail.com',
		to: request.body.email,
		subject: 'Email Authentication Using Nodejs for Open Source Report Project testing',
		priority: 'high',
		text: `Hey Welcome! Your One Time Password is 😋 : ${otp}
		  
		  
		  
		  
		  
		  
		  𝒯𝒽𝒶𝓃𝓀𝓈 𝒻𝑜𝓇 𝒞𝒽𝑜𝑜𝓈𝒾𝓃𝑔 𝒰𝓈. 
		  𝒜𝓁𝓁 𝓁𝑜𝓋𝑒 𝒻𝓇𝑜𝓂 𝒪𝓅𝑒𝓃 𝒮𝑜𝓊𝓇𝒸𝑒 𝒯𝑒𝒶𝓂.
  
				-𝓈𝓈𝓈𝓈
  
		  `
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	response.send(request.body.email)

});

//VERIFY OTP
router.post('/verifyOTP', (request, response) => {
	console.log(request.body.otp)
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("check");
		var query = { "otp": request.body.otp };
		dbo.collection("temp2").find(query).toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
			if (result.length === 0) response.sendStatus(404);
			else response.sendStatus(200);
			db.close();
		});
	});
});

module.exports = router;