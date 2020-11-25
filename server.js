const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const app = express();
var cors = require('cors')
var logger = require('./logs_config/winston');
const createError = require('http-errors');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use('/api/otp', require('./routes/api/otp'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
  });
  
// error handler - have to see the impact
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	logger.error(`${req.method} - ${err.message} - ${req.originalUrl} - ${req.ip}`);
  	
	  // render the error page
	res.status(err.status || 500);
	res.json({
		message: err.message,
		status: err.status,
		error: err
	  });

	next(err);
	
});