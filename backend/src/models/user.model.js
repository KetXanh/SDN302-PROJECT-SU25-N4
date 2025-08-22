const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    account: {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'Employee'],
        default: 'User',
        required: true,
    },
    avatar: {
        data: Buffer,  // Store image data
        contentType: String,  // Store MIME type of the image
        size: Number  // Store size of the image
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Banned'],
        default: 'Active',
        required: true,
    },
}, {
  timestamps: true,
  versionKey: false
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;