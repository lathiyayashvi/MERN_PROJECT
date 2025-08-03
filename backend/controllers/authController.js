const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");

// Generating JWT token
const generateToken = (res, id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 60 * 60 * 1000,
    });
    return token;
};

// Register User
const registerUser = async(req, res) => {
    const {fullName, email, password, profileImageUrl} = req.body;

    // Validate: checking for missing fields
    if(!fullName || !password || !email){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        // check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already in use"});
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Greetings from Expense Tracker Website',
            text: `Welcome to Expense Tracker website. Your account has been created with email id  ${email} successfully.`
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(res, user._id),
        });
    } catch(err){
        res.status(500).json({
            message: "Error registering user", 
            error: err.message
        });
    }
};

// Login User
const loginUser = async(req, res) => {
    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message: "Invalid credentials"})
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(res, user._id),
        });
    }catch(err){
        res.status(500).json({
            message: "Error logging user", 
            error: err.message
        });
    }
};

// Logout User
const logoutUser = async(req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({message: "LogOut Successfully"});

    }catch(err){
        res.status(500).json({
            message: "Error in logging out", 
            error: err.message
        });
    }
}

// Get User Info
const getUserInfo = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        console.log(user);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    }catch(err){
        res.status(500).json({
            message: "Error getting user info", 
            error: err.message
        });
    }
};

// Send Verification OTP to user's email
const sendVerifyOTP = async(req, res) => {
    try{
        const userId = req.user._id;

        
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user.isAccountVerified){
            return res.json({message: "Account is already Verified."});
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = OTP;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${OTP}. Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Verification OTP sent on email successfully."
        });

    }catch(error){
        res.status(500).json({
            message: "Error in sending OTP", 
            error: error.message
        });
    }
}

// Verifying account using OTP
const verifyEmail = async(req, res) => {
    const userId = req.user._id;
    const {OTP} = req.body;

    if(!userId || !OTP){
        return res.status(400).json({message: "Missing Details"});
    }

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== OTP){
            return res.json({message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({message: "OTP Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.status(200).json({message: "Account verified successfully."});

    }catch(error){
        res.status(500).json({
            message: "Error in Verifing email", 
            error: error.message
        });
    }
}

// Check user is authenticated or not
const isAuthenticated = async(req, res) => {
    try{
        res.json({message: "User is Authenticated"});
    }catch(error){
         res.status(500).json({
            message: "Error in checking user authenticated or not", 
            error: error.message
        });
    }
}

// Send Password reset OTP
const sendPasswordResetOTP = async(req, res) => {
    const {email} = req.body;

    if(!email){
        return res.json({message: "Email is required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = OTP;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${OTP}. Reset your password using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Password Reset OTP sent on email successfully."
        });

    }catch(error){
        res.status(500).json({
            message: "Error in sending OTP for reset password", 
            error: error.message
        });
    }
}

// Reset User Password
const resetPassword = async(req, res) => {
    const {email, OTP, newPassword} = req.body;

    if(!email || !OTP || !newPassword){
        return res.json({message: "Email, OTP and new Password are required."});
    }

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== OTP){
            return res.json({message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({message: "OTP Expired"});
        }

        // In my User.js model, I already hashed the password when it is change. so no need to write here, directly we can update password with new password

        user.password = newPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        res.status(200).json({message: "Password has been reset successfully."});

    }catch(error){
        res.status(500).json({
            message: "Error in resetting password", 
            error: error.message
        });
    }
}

// Edit user profile
const editProfile = async (req, res) => {

  try {
    const userId = req.user._id;
    const { fullName, currentPassword, newPassword, profileImageUrl} = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(req.body, fullName, currentPassword, newPassword, profileImageUrl);
    // Update full name
    if (fullName) user.fullName = fullName;
    if(profileImageUrl){
        user.profileImageUrl = profileImageUrl;
    }
    console.log(req.file);
    // Update profile image if uploaded
    if (req.file) {
        const baseURL = process.env.BACKEND_URL || `https://${req.get("host")}`;
      const imageUrl = `${baseURL}/uploads/${req.file.filename}`;
      console.log(imageUrl);
      user.profileImageUrl = imageUrl;
    }

    // If user wants to change password
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = newPassword; // will be auto-hashed via pre-save hook
    }

    await user.save();

    // Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ message: "Profile updated", user: userData });

  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};

// Google Authentication
const googleCallback = async(req, res) => {
    try{
        const id = req.user._id;
        const token = generateToken(res, id);

        res.redirect(`${process.env.UI_URL}/success-login?access_token=${token}`);
    }catch(error){
        console.error('Error during google callback', error);
        res.status(500).json({message: "Internal server error during login"});
    }
}



module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    logoutUser,
    sendVerifyOTP,
    verifyEmail,
    isAuthenticated,
    sendPasswordResetOTP,
    resetPassword,
    editProfile,
    googleCallback, 
};