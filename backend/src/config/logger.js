const fs = require('fs');
const path = require('path');
const winston = require('winston');
const moment = require('moment');

// Ensure logs folder exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Generate log filename per week
const currentYear = moment().format('YYYY');
const currentWeek = moment().week();
const logFileName = path.join(logDir, `app_${currentYear}_week${currentWeek}.log`);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFileName }),
    ],
});

// Express middleware for logging user actions
function logUserActivity(req, res, next) {
    // Capture request metadata
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'];
    const userId = req.user ? req.user.id : "Guest";

    // Store request start time
    const start = Date.now();

    // Log after response is finished
    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info(JSON.stringify({
            time: new Date().toISOString(),
            userId,
            method,
            url: originalUrl,
            statusCode: res.statusCode,
            ip,
            userAgent,
            duration: `${duration}ms`
        }));
    });

    next();
}

module.exports = { logger, logUserActivity };
