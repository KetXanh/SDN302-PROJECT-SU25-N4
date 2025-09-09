const applyConfig = require('./corConfig');
const connectDB = require('./database');
const { logger, logUserActivity } = require('./logger');

module.exports = {
    connectDB,
    logUserActivity,
    logger,
    applyConfig
};
