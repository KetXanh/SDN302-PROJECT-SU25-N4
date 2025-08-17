const jwt = require('jsonwebtoken');
require('dotenv').config();


// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60, // 1 hour
    });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 7, // 1 week
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
}


module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };