const applyConfig = require('./corConfig');
const connectDB = require('./database');
const logger = require('./logger');

module.exports = {
    connectDB,
    logger,
    applyConfig
};
