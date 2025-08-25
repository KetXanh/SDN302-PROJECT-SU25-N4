const User = require('./user.model');
const Otp = require('./otp.model');
const db = {}

db.User = User;
db.Otp = Otp;

module.exports = db;