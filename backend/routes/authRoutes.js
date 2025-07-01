const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const passport = require("passport");

const {registerUser, loginUser, getUserInfo, logoutUser, sendVerifyOTP, verifyEmail, isAuthenticated, sendPasswordResetOTP, resetPassword, editProfile, googleCallback} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/getUser", protect, getUserInfo);

router.post("/send-verify-otp", protect, sendVerifyOTP);

router.post("/verify-account", protect, verifyEmail);

router.post("/is-auth", protect, isAuthenticated);

router.post("/send-reset-otp", sendPasswordResetOTP);

router.post("/reset-pass", resetPassword);

router.put("/edit-profile", protect, upload.single("image"), editProfile);

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get("/google/callback", passport.authenticate('google', {session: false}), googleCallback);

router.post("/upload-image", upload.single("image"), (req,res) => {
    if(!req.file){
        return res.status(400).json({message: "No file uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});


module.exports = router;