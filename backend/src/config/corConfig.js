const cors = require('cors');
require('dotenv').config();
const applyConfig = (app) => {
    app.use(cors({
        origin: ["http://localhost:5173", "http://192.168.139.1:5173"],
        credentials: true,
    }));
};

module.exports = applyConfig;
