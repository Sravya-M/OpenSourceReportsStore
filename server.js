const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const app = express();

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

app.use(express.json());

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


/*
let gfs;
const URI = 
const conn = mongoose.createConnection(process.env.MONGODB_URI || db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
conn.once('open', () => {
	//Init stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
})

//Create storage engine
const crypto = require('crypto');
//const path = require('path');
//const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
	url: db,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});
const upload = multer({ storage });

*/
// Use routes
app.use('/api/items', require('./routes/api/Items'));
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

app.listen(port, () => console.log(`Server started on port ${port}`));