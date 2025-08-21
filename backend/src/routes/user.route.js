const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get All
router.get('/all', userController.getUsers);

// Export the router
module.exports = router;