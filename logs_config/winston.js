// winston logger
// for our project, we need user activity data
// logger INFORMATION `[${ISO8601 DATE}] [${LOG LEVEL}] [Message: ] [ActivityID: ] [UserID: ] [Context: ] [UserType: }] [UserName: ] [UserEmail: ]`;
// LOG LEVEL: VERBOSE, INFO, WARNING, ERROR, CRITICAL
// ActivityID: ID of a particular login of a User (taken from 3rd part of JWT (Part1.Part2.Part3))
// UserID: id of the user in database
// Context: File from which the log information is coming
// UserType: Admin, Insider, Outsider

var winston=require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

var filename="logs_config/logs/app"+""+".log";

// defining a custom logger type
const file = {
    level: 'info',
    filename: filename,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf( L => {
        const formattedDate = L.timestamp.replace('T', ' ').replace('Z', '');
        return `[${formattedDate}] [${L.level}] [${L.message}] [ActivityID: ${L.activityId}] [UserID: ${L.userId}] [${L.userType}] [${L.name}] [${L.email}] [${L.context}]`;
       })
     ),
    maxsize: 5242880, // 5MB
    //maxFiles: 5,
    colorize: false,
  }

// transport options for elastic search (json has to be true)
const esTransportOpts = {
    level: 'info',
    index: 'OpenSourceReportsLogs',
    json: true,
    clientOpts: {
        node: "http://localhost:9200"
    }
  };

const logger = winston.createLogger({
    level:'info',
    
    transports: [
        new winston.transports.Console(),
        new winston.transports.File(file),
        //new ElasticsearchTransport(esTransportOpts)
    ],
});

module.exports = logger;