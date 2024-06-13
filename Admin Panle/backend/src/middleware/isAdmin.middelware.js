const user = require('../models/user.model.js');
const jwt = require("jsonwebtoken")
const ApiResponse = require('../utils/ApiResponse.js');

exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized request"));
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const User = await user.findById(decodedToken?._id).select("-password -refreshToken");
        console.log(User.email);
        if (User.isAdmin) req.isAdmin = true
        if (!(User.isAdmin)){ 
            req.isAdmin = false
         return res.status(401).json(new ApiResponse(401, null, "you are not Admin"));
        }
            
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse(500, error?.message, 'Unable to validate access token'));
    }
};