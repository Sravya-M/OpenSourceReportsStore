// winston logger
// we have formats (json, simple, ), log levels (CRITICAL, ERROR, WARNING, INFO, ), transports to (file, console, Elastic, etc), configurations,
// time, file size setups etc

// for our project, we need user activity data

var winston=require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

var filename="logs_config/logs/app"+""+".log";

const file = {
    level: 'info',
    filename: filename,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(loginput => {
        const formattedDate = loginput.timestamp.replace('T', ' ').replace('Z', '');
        return `[${formattedDate}] [${loginput.level}] [Message: ${loginput.message}] [ActivityID: ${loginput.activityId}] [UserID: ${loginput.userId}] [Context: ${loginput.context}]`;
       })
     ),
    maxsize: 5242880, // 5MB
    //maxFiles: 5,
    colorize: false,
  }

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