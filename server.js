const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const app = express();
var cors = require('cors')

var nodemailer = require('nodemailer');  
//const express = require('express');
const bodyParser = require('body-parser');
//const app = express();
//const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

app.use(express.json());
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
// DB Config
const db = config.get('mongoURI');

//Connect to mongo
mongoose.connect(process.env.MONGODB_URI || db, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
})
	.then(() => console.log("MongoDB Connected..."))
	.catch(err => console.log(err));

// Use routes
app.use('/api/users', require('./routes/api/Users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/reports', require('./routes/api/reports'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}
const port = process.env.PORT || 5000;


// SEND OTP
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'iiitbemailverify@gmail.com',
	  pass: 'admin123ssss'
	}
  });
  
  app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
  });
  
  app.use(express.json());
  
  // Access the parse results as request.body
  function generateOTP() { 
			
	  // Declare a digits variable  
	  // which stores all digits 
	  var digits = '0123456789'; 
	  let OTP = ''; 
	  for (let i = 0; i < 4; i++ ) { 
		  OTP += digits[Math.floor(Math.random() * 10)]; 
	  } 
	  return OTP; 
  } 
  
  
  app.post('/sendOTP', function(request, response){
	  var MongoClient = require('mongodb').MongoClient;
	  var url = "mongodb://localhost:27017/";
	  var otp= generateOTP()
	  MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("check");
		  var myobj = { "createdAt": new Date(),"otp": otp};
		  dbo.collection("temp2").insertOne(myobj, function(err, res) {
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
	  transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
		});
	
	  response.send(request.body.email)
	  
  });


  //VERIFY OTP
app.post('/verifyOTP', function(request, response){
    console.log(request.body.otp)
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("check");
        var query = { "otp": request.body.otp };
        dbo.collection("temp2").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          if(result.length===0) response.sendStatus(404);
          else  response.sendStatus(200);
          db.close();
        });
      });
    });
  

app.listen(port, () => console.log(`Server started on port ${port}`));