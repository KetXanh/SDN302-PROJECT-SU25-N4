const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get All
router.get('/all', userController.getUsers);

// Get User by Id
router.get('/:id', userController.getUserById);

// Update User
router.put('/update/:id', userController.updateUser);

// Ban User
router.put('/ban/:id', userController.banUser);

// Delete User
router.delete('/delete/:id', userController.deleteUser);

//Get Profile
router.get('/profile', userController.getProfile);

// Export the router
module.exports = router;