const express = require('express');
const router = express.Router();
const {verifyJWT} = require("../middleware/auth.js")

const { createCategory, createSubcategory} = require('../controllers/admin.controllers.js');

router.post("/createCategory",createCategory);
router.post("/createSubcategory",createSubcategory);


module.exports = router;

//appliances  entertaimment pets grocery animals