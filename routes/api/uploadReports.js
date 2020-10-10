const multer = require("multer");
const path = require("path");

const storageEngine = multer.diskStorage({
	destination: "./uploads",
	filename: function (req, file, fn) {
		fn(
			null,
			new Date().getTime().toString() +
			"-" +
			file.fieldname +
			path.extname(file.originalname)
		);
	}
});

var validateFile = function (file, cb) {
	allowedFileTypes = /pdf/;
	const extension = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimeType = allowedFileTypes.test(file.mimetype);
	if (extension && mimeType) {
		return cb(null, true);
	} else {
		cb("Invalid file type. Only PDF files are allowed.");
	}
};

const uploadReports = multer({
	storage: storageEngine,
	limits: { fileSize: 200000 },
	fileFilter: function (req, file, cb) {
		validateFile(file, cb);
	}
}).single("file");

module.exports = uploadReports;