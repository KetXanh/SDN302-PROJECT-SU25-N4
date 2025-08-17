const dt = require('../models');
const { hashPassword, isMatch } = require('../utils/Hasher');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/JwtService');
//Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await dt.User.findOne({ 'account.username': username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isValidPassword = await isMatch(password, user.account.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    //Store both token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7 * 1000 // 1 week
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7 * 1000 // 1 week
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.account.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Register
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username, password, and email are required." });
        }
    
        const existingUser = await dt.User.findOne({ 'account.username': username });

        if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
        }
    
        const hashedPassword = await hashPassword(password);
        const newUser = new dt.User({
        account: {
            username,
            password: hashedPassword
        },
        email,
        role: 'User', // Default role
        status: 'Active' // Default status
        });
    
        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

//Refresh token
const refreshToken = async (req, res) => {
  try{
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const user = await dt.User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7 * 1000 // 1 week
    });

    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
//Logout
const logout = (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    login,
    register,
    logout,
    refreshToken
};
