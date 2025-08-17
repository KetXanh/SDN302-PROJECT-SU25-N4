const winston = require('winston');
const moment = require('moment');

// Get the current week of the year and year
const currentYear = moment().format('YYYY');
const currentWeek = moment().week();
const logFileName = `logs/app_${currentYear}_week${currentWeek}.log`;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFileName }),
    ],
});

module.exports = logger;
