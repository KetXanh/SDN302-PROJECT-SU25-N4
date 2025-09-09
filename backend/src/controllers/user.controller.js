const db = require("../models/index")
const { hashPassword } = require("../utils/Hasher");
const ExcelJS = require("exceljs");
//Get All User
const getUsers = async (req, res) => {
    try {
        const users = await db.User.find().select('-__v -account').sort({ createdAt: 1, status: 1 });
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
        //Check username existed
        const existingUser = await db.User.findOne({ 'account.username': username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        //Check email existed
        const existingEmail = await db.User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
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
        const { email, fullname, gender, phone, address, role, avatar } = req.body;
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
        // const currentUser = await db.User.findById(req.user.id);
        if (user.role === "Admin") return res.status(400).json({ error: 'Cannot ban admin with the same role as you' });
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
    try {
        res.status(200).json("Test Profile")
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//Edit Profile
const editProfile = async (req, res) => {
    try {
        const user = await db.User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Import list of users from frontend (JSON array)
const importUsers = async (req, res) => {
    try {
        const { users } = req.body; // users: [ { username, password, email, ... }, ... ]
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ error: "Invalid users data" });
        }
        const createdUsers = [];

        //Check username is unique in the import list
        const usernames = users.map(u => u.username);
        const uniqueUsernames = new Set(usernames);
        if (uniqueUsernames.size !== usernames.length) {
            return res.status(400).json({ error: "Failed to import user data with error: Usernames in the import list must be unique" });
        }
        //Check email is unique in the import list
        const emails = users.map(u => u.email);
        const uniqueEmails = new Set(emails);
        if (uniqueEmails.size !== emails.length) {
            return res.status(400).json({ error: "Failed to import user data with error: Emails in the import list must be unique" });
        }

        //Validate each user
        for (let u of users) {
            u.username = u.username.trim();
            u.email = u.email.trim().toLowerCase();
            u.role = u.role.trim();
            if (!u.username || !u.email || !u.role) continue;

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(u.email)) {
                return res.status(400).json({ error: `Failed to import user data with error: Invalid email format for ${u.email}` });
            }
            // Validate role
            const validRoles = ["Admin", "Manager", "Employee"];
            if (!validRoles.includes(u.role)) {
                return res.status(400).json({ error: `Failed to import user data with error: Invalid role for ${u.username}. Must be one of ${validRoles.join(", ")}` });
            }

            // Validate date createdAt, updatedAt if provided
            if (u.createdAt && isNaN(Date.parse(u.createdAt))) {
                return res.status(400).json({ error: `Failed to import user data with error: Invalid createdAt date for ${u.username}` });
            }
            if (u.updatedAt && isNaN(Date.parse(u.updatedAt))) {
                return res.status(400).json({ error: `Failed to import user data with error: Invalid updatedAt date for ${u.username}` });
            }

            // Check username tồn tại
            const existedUser = await db.User.findOne({ "account.username": u.username });
            if (existedUser) throw ({ error: `Failed to import user data with error: Username ${u.username} already exists` });

            // Check email tồn tại
            const existedEmail = await db.User.findOne({ email: u.email });
            if (existedEmail) throw ({ error: `Failed to import user data with error: Email: ${u.email} already exists` });
        }

        // Create users
        for (let u of users) {
            const hashPasswordValue = await hashPassword(u.password || "123456");
            const newUser = await db.User.create({
                account: {
                    username: u.username,
                    password: hashPasswordValue
                },
                email: u.email,
                fullname: u.fullname,
                gender: u.gender,
                phone: u.phone,
                address: u.address,
                role: u.role,
                status: u.status || "Active",
                avatar: u.avatar || "",
            });
            createdUsers.push(newUser);
        }

        res.status(201).json({
            message: "Import successful",
            count: createdUsers.length,
            users: createdUsers,
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Export list of users to Excel file
const exportUsers = async (req, res) => {
    try {
        const users = await db.User.find().select("-avatar -__v").lean();

        // Tạo workbook và worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        // Header
        worksheet.columns = [
            { header: "Username", key: "username", width: 20 },
            { header: "Full Name", key: "fullname", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "Address", key: "address", width: 30 },
            { header: "Role", key: "role", width: 12 },
            { header: "Status", key: "status", width: 12 },
            { header: "Created At", key: "createdAt", width: 20 },
            { header: "Updated At", key: "updatedAt", width: 20 },
        ];

        // Data
        users.forEach((u) => {
            worksheet.addRow({
                username: u.account.username,
                fullname: u.fullname || "N/A",
                email: u.email || "N/A",
                gender: u.gender || "N/A",
                phone: u.phone || "N/A",
                address: u.address || "N/A",
                role: u.role || "N/A",
                status: u.status,
                createdAt: u.createdAt || "N/A",
                updatedAt: u.updatedAt || "N/A",
            });
        });

        // Style header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "CCCCCC" },
            };
        });

        // Gửi file về client
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    banUser,
    activateUser,
    deleteUser,
    getProfile,
    editProfile,
    importUsers,
    exportUsers
}