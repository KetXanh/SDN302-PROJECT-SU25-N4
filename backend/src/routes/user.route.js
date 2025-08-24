const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get All
router.get('/all', userController.getUsers);

// Get User by Id
router.get('/:id', userController.getUserById);

//Create User
router.post('/create', userController.createUser);

// Update User
router.put('/update/:id', userController.updateUser);

// Ban User
router.put('/ban/:id', userController.banUser);

// Activate User
router.put('/activate/:id', userController.activateUser);

// Delete User
router.delete('/delete/:id', userController.deleteUser);

//Get Profile
router.get('/profile', userController.getProfile);

//Edit Profile
router.put('/profile', userController.editProfile);

// Export the router
module.exports = router;