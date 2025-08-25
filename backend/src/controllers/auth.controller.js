const db = require('../models');
const { hashPassword, isMatch } = require('../utils/Hasher');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/JwtService');
const { sendMail } = require('../utils/Mailer');
//Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await db.User.findOne({ 'account.username': username });
    if (!user) {
      return res.status(404).json({ message: "Username or password is incorrect." });
    }
    


    const isValidPassword = await isMatch(password, user.account.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Username or password is incorrect." });
    }

    if(user.status === 'Inactive') {
      return res.status(403).json({ message: "Your account is inactive." });
    }

    if(user.status === 'Banned') {
      return res.status(403).json({ message: "Your account is banned." });
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

    if (email) {
      const existingEmail = await db.User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    const existingUser = await db.User.findOne({ 'account.username': username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new db.User({
      account: {
        username,
        password: hashedPassword
      },
      email,
      role: 'Employee',
      status: 'Active'
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
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const user = await db.User.findById(decoded.id);
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

//Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const newOtp = new db.Otp({
      email,
      otp,
      type: 'ForgotPassword',
      expiresAt
    });
    await newOtp.save();

    // Send OTP via email
    sendMail(email, 'Password Reset OTP', `Your OTP is: ${otp}`, `<p>Your OTP is: <b>${otp}</b></p>`, (err, info) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ message: "Failed to send OTP email." });
      } else {
        console.log("OTP email sent:", info.response);
      }
    });

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
//Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const existingOtp = await db.Otp.findOne({ email, otp, type: 'ForgotPassword', isVerified: false });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Mark OTP as verified
    existingOtp.isVerified = true;
    await existingOtp.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

//Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    const existingOtp = await db.Otp.findOne({ email, otp, type: 'ForgotPassword', isVerified: true });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.account.password = hashedPassword;
    await user.save();

    // Delete the used OTP
    await db.Otp.findByIdAndDelete(existingOtp._id);
    res.status(200).json({ message: "Password reset successful." });
  }
  catch (error) {
    console.error("Reset password error:", error);
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
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken
};
