require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/database');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routes = require('./routes');
const { logger, applyConfig } = require('./config');

const app = express();
app.use(cookieParser());

// Apply middlewares
applyConfig(app);

// Connect to MongoDB
connectDB();
require('dotenv').config();

app.use(morgan('dev'));
app.use(helmet());

// Middleware to parse JSON bodies with increased limit
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
