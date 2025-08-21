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

module.exports={
    getUsers
}