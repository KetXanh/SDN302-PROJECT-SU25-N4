require('dotenv').config();
const { logger } = require('./src/config');
const app = require('./src/app');
const http = require('http');
const PORT = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Home route
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Start the server
server.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
