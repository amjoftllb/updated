
// user.Routes.js
const express = require('express');
const router = express.Router();
const { registerUser} = require('../controllers/user.Contollers.js');

router.post("/registerUser",registerUser); 

module.exports = router;
