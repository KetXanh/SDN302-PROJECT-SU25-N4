const db = require("../models/index")
const { hashPassword } = require("../utils/Hasher");
//Get All User
const getUsers = async (req, res) => {
    try {
        const users = await db.User.find().select('-__v -account').sort({ createdAt: 1 , status: 1});
        const formatUsers = users.map(user => ({
            id: user._id,
            ...user._doc,
            _id: undefined
        }));
        res.status(200).json(formatUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get User by Id
const getUserById = async (req, res) => {
    try {
        const user = await db.User.findById(req.params.id).select('-__v -account');
        if (!user) return res.status(404).json({ error: 'User not found' });
        const formatUser = {
            id: user._id,
            ...user._doc,
            _id: undefined
        }
        res.status(200).json(formatUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Create new user
const createUser = async (req, res) => {
    try {
        const { username, password, email, fullname, gender, phone, address, role, avatar } = req.body;
        if (!username || !password || !email || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const hashPasswordValue = await hashPassword(password);
        const user = await db.User.create({
            account: {
                username,
                password: hashPasswordValue
            },
            email,
            fullname: fullname || username,
            gender,
            phone,
            address: address || '',
            role: role || 'Employee',
            avatar
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Update user
const updateUser = async (req, res) => {
    try {
        const {  email, fullname, gender, phone, address, role, avatar } = req.body;
        const user = await db.User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        Object.assign(user, {
            email: email || user.email,
            fullname: fullname || user.fullname,
            gender: gender || user.gender,
            phone: phone || user.phone,
            address: address || user.address,
            role: role || user.role,
            avatar: avatar || user.avatar
        });
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Ban user
const banUser = async (req, res) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.status = "Banned";
        await user.save();
        res.status(200).json({ message: 'User banned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Active user
const activateUser = async (req, res) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.status = "Active";
        await user.save();
        res.status(200).json({ message: 'User activated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await db.User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get User Profile
const getProfile = async (req, res) => {
    try{
       res.status(200).json("Test Profile")
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

//Edit Profile
const editProfile = async (req, res) => {
    try{
        const user = await db.User.findById(req.user.id);
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
    activateUser,
    deleteUser,
    getProfile,
    editProfile
}