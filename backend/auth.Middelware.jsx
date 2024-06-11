const user = require('../models/user.Models.js');
const jwt = require("jsonwebtoken")
const ApiResponse = require('../utils/ApiResponse.js');

exports.verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized request"));
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const User = await user.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!User) {
            return res.status(401).json(new ApiResponse(401, null, 'Invalid Access Token'));
        }
        req.user = User;
        next();
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error?.message, 'Unable to validate access token'));
    }
};
