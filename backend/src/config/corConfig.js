const cors = require('cors');
require('dotenv').config();
const applyConfig = (app) => {
    app.use(cors({
        origin: ["*"],
        credentials: true,
    }));
};

module.exports = applyConfig;
