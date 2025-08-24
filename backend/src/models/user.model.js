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
        default: 'Employee',
        required: true,
    },
    avatar: {
        data: Buffer, 
        contentType: String,  
        size: Number 
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