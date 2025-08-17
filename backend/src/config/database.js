require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/AuthenticationBase';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
    }
module.exports = connectDB;
