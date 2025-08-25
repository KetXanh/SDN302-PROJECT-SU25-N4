const cors = require('cors');
require('dotenv').config();
const applyConfig = (app) => {
    app.use(cors({
        origin: ["*"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }));
};

module.exports = applyConfig;
