
// user.Routes.js
const express = require('express');
const router = express.Router();

const { signUp, signIn , sendOtp , verifyOtp , googleAuth ,} = require('../controllers/user.controllers.js');

router.post("/signUp",signUp); 
router.post("/signIn",signIn); 
router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);
router.post("/googleAuth",googleAuth);   


module.exports = router;
