
// user.Routes.js
const express = require('express');
const upload = require("../middleware/multer.Middelware.js");
const router = express.Router();
const { verifyJWT } = require('../middleware/auth.Middelware.js'); 
const { registerUser, allUser, updateDetails, logIn, logOut, refreshAccessToken, getCurrentUser ,RegisterUserverifyOTP,sendOTP} = require('../controllers/user.Contollers.js');

router.post("/registerUser",upload.single('avatar'),registerUser); 
router.post("/allUser", verifyJWT, allUser); 
router.post("/updateDetails",upload.single('avatar'), verifyJWT, updateDetails); 
router.post("/logIn", logIn); 
router.post("/logOut", verifyJWT, logOut); 
router.post("/refreshAccessToken", refreshAccessToken); 
router.post("/getCurrentUser", verifyJWT, getCurrentUser);
router.post("/RegisterUserverifyOTP", RegisterUserverifyOTP); 
router.post("/sendOTP", sendOTP); 

module.exports = router;

