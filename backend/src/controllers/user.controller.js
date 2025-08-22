const db = require("../models/index")

//Get All User
const getUsers = async (req, res) => {
    try {
        const users = await db.User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get User by Id
const getUserById = async (req, res) => {
    try {
        const user = await db.User.findOne({ uid: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Create new user
const createUser = async (req, res) => {
    try {
        const user = await db.User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Update user
const updateUser = async (req, res) => {
    try {
        const user = await db.User.findOne({ uid: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Ban user
const banUser = async (req, res) => {
    try {
        const user = await db.User.findOne({ uid: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.isBan = true;
        await user.save();
        res.status(200).json({ message: 'User banned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await db.User.findOneAndDelete({ uid: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get User Profile
const getProfile = async (req, res) => {
    try{
        const user = await db.User.findOne({ uid: req.user.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

//Edit Profile
const editProfile = async (req, res) => {
    try{
        const user = await db.User.findOne({ uid: req.user.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
module.exports={
    getUsers,
    getUserById,
    createUser,
    updateUser,
    banUser,
    deleteUser,
    getProfile
}