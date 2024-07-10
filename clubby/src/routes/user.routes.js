
// user.Routes.js
const express = require('express');
const router = express.Router();
const {verifyJWT} = require("../middleware/auth.js")
const { signUp, 
    googleAuth, 
    appleAuth, 
    facebookAuth, 
    signIn, 
    sendOtp, 
    verifyOtp,
    logout, 
    resetPassword,
    uploadAvatar,
    createPost
} = require('../controllers/user.controller.js');
const { fetchallcategory,
    fetchsubcategory,
    fetchSubCategoryProduct 
} = require('../controllers/data.controller.js');

//user
router.post("/signUp",signUp);
router.post("/googleAuth",googleAuth); 
router.post("/appleAuth",appleAuth);
router.post("/facebookAuth",facebookAuth);
router.post("/signIn",signIn); 
router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);
router.post("/logout",verifyJWT,logout);
router.post("/resetPassword",resetPassword);
router.post("/uploadAvatar",uploadAvatar);
router.post("/createPost",verifyJWT,createPost);

//App data
router.post("/fetchallcategory",verifyJWT,fetchallcategory);
router.post("/fetchsubcategory",verifyJWT,fetchsubcategory);
router.post("/fetchSubCategoryProduct",verifyJWT,fetchSubCategoryProduct);

module.exports = router;
