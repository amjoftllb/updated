const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer.js")
const {verifyJWT} = require("../middleware/auth.js")
const { signUp, 
    login,
    getuser,
    logout,
    findAllUsers,
    getRoomId
} = require('../controllers/user.controller.js');


//user
router.post("/signUp",upload.single('avatar'),signUp);
router.post("/login",login); 
router.post("/getuser",verifyJWT,getuser);
router.post("/findAllUsers",verifyJWT,findAllUsers);
router.post("/getRoomId",getRoomId); 
 router.post("/logout",verifyJWT,logout);


module.exports = router;
