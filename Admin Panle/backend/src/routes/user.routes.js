
// user.Routes.js
const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/auth.middelware.js');
const {isAdmin} = require('../middleware/isAdmin.middelware.js');
const { registerUser,updateDetails,logIn ,deleteUserByadmin , UpdateUserDetailsByAdmin} = require('../controllers/user.controller.js');

router.post("/registerUser",registerUser); 
router.post("/updateDetails",verifyJWT ,updateDetails); 
router.post("/logIn",logIn); 
router.post("/deleteUserByadmin",isAdmin ,deleteUserByadmin); 
router.post("/UpdateUserDetailsByAdmin",isAdmin ,UpdateUserDetailsByAdmin);


module.exports = router;
